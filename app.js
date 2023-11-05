import express from "express";
import {config} from "dotenv";
import user from './router/user.js'
import { errorMiddlware } from "./middleware/error.js";
import cookieParser from "cookie-parser"
import cors from 'cors'

export const app = express()
config({
    path:'./data/.env'
})
// middleware 
app.use(express.json())
app.use(cookieParser())
app.use(
    cors({
        credentials:true,
        methods:["GET", "POST", "PUT", "DELETE"],
        origin:[process.env.FRONTEND_URL_1, process.env.FRONTEND_URL_2],
    })
)








// Routes 
app.use('/api/v1/user', user)


// ErrorMiddleware 
app.use(errorMiddlware)
