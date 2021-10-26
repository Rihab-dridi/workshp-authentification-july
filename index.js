const express=require('express')
const app=express()
require('dotenv').config()
const cors=require('cors')
//connect the DB
const connectDB=require('./config/connectDB')
connectDB()
//middlewares
app.use(cors())
app.use(express.json())
app.use('/api/auth',require('./routes/user'))

//listen to the port 
const Port=5000
app.listen(Port, err=>{
    err? console.log(err): console.log(`the server is up and running on ${Port}... `)
})