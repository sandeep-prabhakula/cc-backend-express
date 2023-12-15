const express = require('express')
const app = express()
const cors = require('cors')
const serverless = require('serverless-http');
require('dotenv').config()
const router = express.Router()
const blogRouter = require('./apis/blogs')
const authRouter = require('./apis/auth')
const adminRouter = require('./apis/adminEndpoints')
const PORT = process.env.PORT || 8080

app.use(cors())
app.use(express.json())

app.use('/',blogRouter)
app.use('/',authRouter)
app.use('/',adminRouter)

app.listen(PORT,()=>{
    console.log('Chustunna Anni observe chestunna...')
})



app.get('/',(req,res)=>{
    console.log(process.env.SECRET_KEY)
    res.end('Server started successfully')
})

app.use('/.netlify/functions/api', router);
module.exports.handler = serverless(app);