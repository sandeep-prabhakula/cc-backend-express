const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const blogRepository = require('../repository/mongoObject')

router.post('/register', async (req, res) => {
    const user = req.body
    const hash = await bcrypt.hash(user.password, 10)
    user.password = hash
    try {
        await blogRepository.connect()
        const db = blogRepository.db('blog')
        const collection = db.collection('users')
        const query = {
            email: req.body.email
        }
        const user = await collection.findOne(query)
        if (user) {
            res.json({
                message: 'User already exists'
            })
        } else {
            await collection.insertOne(req.body)
            res.json({
                message: "Registration successful"
            })
        }
        await blogRepository.close()
    } catch (error) {
        res.json({
            message: error.message
        })
    }
})

router.post('/authenticate',async(req,res)=>{
    const currentUser = req.body
    const password = currentUser.password
    try{
        await blogRepository.connect()
        const db = blogRepository.db('blog')
        const collection = db.collection('users')
        const query = {
            email: req.body.email
        }
        const user = await collection.findOne(query)
        const isPassowrdValid = await bcrypt.compare(password, user.password)
        if (isPassowrdValid) {
            res.send({
                'token': jwt.sign(user, `${process.env.SECRET_KEY}`, {
                    expiresIn:1800
                }),
            })
        }else{
            res.send({
                'Message': 'Invalid User Credentials'
            })
        }
        await blogRepository.close()

    }catch(err){
        res.json({
            message:err.message
        })
    }
})
module.exports = router