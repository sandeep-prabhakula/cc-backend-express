require('dotenv').config()
const jwt = require('jsonwebtoken')


const userVerification = (req,res,next)=>{
    if(!req.headers.authorization){
        return res.status(401).send('unauthorized request')
    }
    const token = req.headers['authorization'].split(' ')[1]
    if(!token){
        return res.status(403).send("Access denied")
    }
    try {
        const decoded = jwt.verify(token,`${process.env.SECRET_KEY}`)
        req.user = decoded
        next()
    } catch (error) {
        console.log(error)
        console.log(error.message)
        res.status(400).send('Bad Request')
    }
}
module.exports = userVerification