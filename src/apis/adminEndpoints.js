const express = require('express')
const router = express.Router()
const blogRepository = require('../repository/mongoObject')
const isAdmin = require('../middleware/validateAdmin')
const { BSON } = require('mongodb')


// Add Blog
router.post('/add-blog', isAdmin, async (req, res) => {
    try {
        await blogRepository.connect()
        const db = blogRepository.db('blog')
        const collection = db.collection('blogs')
        await collection.insertOne(req.body)
        res.status(201).send({
            "Message": "Blog Uploaded Successfully"
        })
    } catch (error) {
        res.json({
            message: error.message
        })
    }finally{
        await blogRepository.close()
    }
})


//update Blog
router.put('/update-blog', isAdmin, async (req, res) => {
    try {
        await blogRepository.connect()
        const db = blogRepository.db('blog')
        const collection = db.collection('blogs')
        const documentId = new BSON.ObjectId(req.body._id)
        const updatedDoc = {
            "title": req.body.title,
            "description": req.body.description,
            "postedAt": req.body.postedAt,
            "image": req.body.image
        }
        const result = await collection.findOneAndUpdate(
            { _id: documentId },
            { $set: updatedDoc },
            { returnDocument: 'after' }
        )
        if (!result.value) {
            return res.status(200).json({ message: 'Blog updated successfully' });
        }else{
            res.status(404).json({ message: 'Blog not found' });
        }

    } catch (error) {
        console.log(error)
        res.json({
            message: error.message
        })
    }finally{
        await blogRepository.close()
    }
})


// Delete Blog
router.delete('/delete-blog/:blogId',isAdmin,async(req,res)=>{
    try {
        await blogRepository.connect()
        const db = blogRepository.db('blog')
        const collection = db.collection('blogs')
        const documentId = new BSON.ObjectId(req.params.blogId)
        const filter = {
            _id:documentId
        }
        await collection.findOneAndDelete(filter)
        res.status(204).json({ message: 'Blog deleted successfully' });
    } catch (error) {
        res.json({
            message: error.message
        })
    }finally{
        await blogRepository.close()
    }
})
module.exports = router