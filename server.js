import express from "express";
import { app } from "./app.js";
import { connectDB } from "./data/dataset.js";







connectDB()



app.listen(process.env.PORT, ()=> {
    console.log(`Server is running on PORT:8000 ${process.env.NODE_ENV}`)
})