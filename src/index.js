const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const blogRouter = require('./apis/blogs')
const authRouter = require('./apis/auth')
const adminRouter = require('./apis/adminEndpoints')
const PORT = process.env.PORT || 8080
const serverless = require('serverless-http')
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

const handler = serverless(app)
module.exports = handler