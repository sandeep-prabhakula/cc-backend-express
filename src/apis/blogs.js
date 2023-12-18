const express = require('express')
const blogRouter = express.Router()
const blogRepository = require('../repository/mongoObject')
const { BSON } = require('mongodb')

// Get blogs (paginated)
blogRouter.get('/get-all-blogs', async (req, res) => {
    try {
        const pageNumber = req.query.pageNumber===null?req.query.pageNumber:1;
        const pageSize = req.query.pageSize===null?req.query.pageSize:5;
        const skip = (pageNumber - 1) * pageSize;
        await blogRepository.connect()
        const db = blogRepository.db('blog')
        const collection = db.collection('blogs')
        const sort = { _id: -1 }
        const data = await collection.find().skip(skip).limit(parseInt(pageSize)).sort(sort).toArray()
        res.json(data)
    } catch (error) {
        res.json({
            message: error.message
        })
    } finally {
        await blogRepository.close()
    }
})

// get Blog by id
blogRouter.get('/blog/:id', async (req, res) => {
    try {
        await blogRepository.connect()
        const db = blogRepository.db('blog')
        const collection = db.collection('blogs')
        const documentId = new BSON.ObjectId(req.params.id)
        const query = { "_id": documentId }
        const data = await collection.findOne(query)
        res.json(data)
    } catch (error) {
        res.json({
            message: error.message
        })
    } finally {
        await blogRepository.close()
    }
})

// Search Blogs
blogRouter.get('/search-blogs/:prompt', async (req, res) => {
    try {
        await blogRepository.connect()
        const db = blogRepository.db('blog')
        const collection = db.collection('blogs')
        const query = [
            {
              '$search': {
                'index': 'default', 
                'wildcard': {
                  'query': `${req.params.prompt}*`, 
                  'path': [
                    'title', 'description'
                  ], 
                  'allowAnalyzedField': true
                }
              }
            }
          ]
          const cursor = collection.aggregate(query);
        const data = await cursor.toArray()
        res.json(data)
    } catch (error) {
        console.log(error)
        res.json({
            message: error.message
        })
    } finally {
        await blogRepository.close()
    }
})
module.exports = blogRouter