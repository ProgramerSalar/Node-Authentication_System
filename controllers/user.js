import express from "express"
import { User } from "../models.js/user.js"
import { asyncError } from "../middleware/error.js"
import ErrorHandler from "../utils/error.js"
import {  sendEmail, sendToken } from "../utils/features.js"







export const Login = asyncError(async (req, res, next) => {

    const {email, password} = req.body
    const user = await User.findOne({email}).select("+password")
    if(!user)
        return next(new ErrorHandler("User is Not Found", 400))
    

    // password 
    const PassMatched = await user.comparePassword(password)
    if(!PassMatched){
        return next(new ErrorHandler("Password is Wrong", 400))
    }
    sendToken(user, res, `Welcome ${user.name}`, 401)
    // res.status(400).json({
    //     success:true,
    //     message:'welcome '
    // })
})



export const SignUp = asyncError(async(req,res, next) => {
    const {name, email, password} = req.body
    let user = await User.findOne({email})
    
    if(user){
        return res.status(401).json({
            success:false,
            message:'User Already Exists!'
        })
    }
    user = await User.create({
        name, email, password
    })
    
    

    sendToken(user, res, 'successfully Register', 401)

    
})


export const getmyProfile = asyncError(async (req, res, next) => {

    const user = await User.findById(req.user._id)
    
    res.status(200).json({
        success:true,
        user
    })


    // res.send('my page')

})







export const Logout = asyncError((req, res, next) => {

    res.status(200).cookie("token", "", {
        expires: new Date(Date.now())
    }).json({
        success:true,
        message:'Logout successfully'
    })
})



export const updateProfile = async (req, res, next) => {

    const user = await User.findById(req.user._id)
    const {name, email, address, city, pinCode} = req.body

    if(name) user.name = name 
    if(email) user.email = email
    if(address) user.address = address
    if(city) user.city = city
    if(pinCode) user.pinCode = pinCode

    await user.save()
    res.status(200).json({
        success:true,
        message:"Profile Updated Successfully"
    })
}





export const changePassword = async(req, res, next) => {

    const user = await User.findById(req.user._id).select("+password")
    // console.log(user)
    const {oldPassword, newPassword} = req.body
    if(!oldPassword) return next(new ErrorHandler("Please Enter OldPassword", 400))
    if(!newPassword) return next(new ErrorHandler("Please Enter NewPassword", 400))
    // compare password 
    const comparePassword = await user.comparePassword(oldPassword)
    if(!comparePassword) return next(new ErrorHandler("Old Password is wrong", 400))
    if(oldPassword === newPassword) return next(new ErrorHandler("Old and New Password are Same, PLease Enter Different Password"))
    // console.log(comparePassword)
    // connect the new password 
    user.password = newPassword
    user.save()


    res.status(400).json({
        success:true,
        message:"Password changed Succussfully"
    })


    
}



export const forgotPassword = async (req, res, next) => {

    const {email} = req.body
    const user = await User.findOne({email})

    // create the random  otp 
    const randomNumber = Math.random() * (999999 - 100000) + 100000
    // console.log(randomNumber)
    const otp  = Math.floor(randomNumber)
    // console.log(otp)
    const otp_expire = new Date(Date.now() + 15 * 60* 1000)
    // console.log(otp_expire)

    // connect the user form the otp 
    user.otp = otp
    user.otp_expire = otp_expire
    await user.save()
    
    // console.log(otp)


    // send the otp in the Mail 
    try{
        await sendEmail("Reset Password", user.email, `otp: ${otp}`)
    }catch(error){
        user.otp = null
        user.otp_expire = null
        user.save()
    }

    res.status(200).json({
        success:true,
        message:'Otp send Succussfully'
    })
    


}



export const resetPassword = async (req, res, next) => {

    const {otp, NewPassword} = req.body
    const user = await User.findOne({otp, otp_expire:{$gt:Date.now()}})

    if(!otp) return next(new ErrorHandler("Invalid Otp", 200))
    if(!NewPassword) return next(new ErrorHandler("Please Enter New Password", 200))

    user.password = NewPassword
    user.otp = undefined
    user.otp_expire = undefined
    
    user.save()


    res.status(400).json({
        success:true,
        message:'Password changed Successfully'
    })



}





