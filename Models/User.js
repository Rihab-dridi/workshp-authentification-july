//require moongoose 
const mongoose=require('mongoose')
const Schema=mongoose.Schema

const userSchema=new Schema({
    name:{
        type:String
    },
    lastname:{
        type:String
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    }, 
    role:{
        type:String,
        default:"user"
    }
})

module.exports=User=mongoose.model('User', userSchema)