import express, { Router } from "express";
import { 
    Login,
    Logout,
    SignUp,
    changePassword,
    forgotPassword,
    getmyProfile,
    resetPassword,
    updateProfile


    
 } from "../controllers/user.js";
import { isAuthenticated } from "../utils/auth.js";



const routes = Router()


routes.post('/login', Login)
routes.post('/new', SignUp)
routes.get('/me', isAuthenticated, getmyProfile)
routes.get('/logout', isAuthenticated, Logout)

// update Routes 
routes.put('/updateprofile', isAuthenticated, updateProfile)
routes.put('/changePassword', isAuthenticated, changePassword)
routes.route('/forgotPassword').post(forgotPassword).put(resetPassword)

// /forgotPassword', isAuthenticated, forgotPassword

export default routes