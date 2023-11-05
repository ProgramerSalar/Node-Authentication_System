import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


const schema = mongoose.Schema({
    name:{
        type:String,
        required:[true, 'please Enter your Name']
    },
    email:{
        type:String,
        required:[true, 'Please Enter Email'],
        validator:validator.isEmail,
        unique:true

    },
    password:{
        type:String,
        required:[true, 'Please Enter Your Password'],
        
    },
    otp:Number,
    otp_expire:Date
})

// hash password 
schema.pre("save", async function (next) {
    if(!this.isModified("password")) return next()
    // console.log(this.password)
    this.password = await bcrypt.hash(this.password, 10)
})


// compare  password 
schema.methods.comparePassword = async function (enterPassword){
    return await bcrypt.compare(enterPassword, this.password)
}



// generate Token 
schema.methods.generateToken = function (){
    return jwt.sign({_id:this._id}, process.env.JSON_SECRET, {
        expiresIn:"15d"

    })
}



export const User = mongoose.model('User', schema)