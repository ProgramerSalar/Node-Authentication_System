import jwt from 'jsonwebtoken'
import { User } from '../models.js/user.js';
import ErrorHandler from './error.js';


export const isAuthenticated = async(req, res, next) => {
    
    
  // token 
    const { token } = req.cookies;
    if(!token){
        return next(new ErrorHandler("Not Loged In", 400))
    }
    // verify token 
    const verifyToken = jwt.verify(token, process.env.JSON_SECRET)
    // console.log(verifyToken)
    
    // find the id 
    req.user = await User.findById(verifyToken._id)
    // console.log(req.user)
    next()


    
}
