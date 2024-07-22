import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import roleRoute from '../api/routes/role.js';
import authRoute from '../api/routes/auth.js';
import userRoute from '../api/routes/user.js';
import bookRoute from '../api/routes/book.js';
import { seedBooksData } from './seed.js';

const app = express();
dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:4200',
    crendentials:true
}

));

app.use("/api/role",roleRoute);
const PORT = 8800;
app.use("/api/auth",authRoute);
app.use("/api/user",userRoute);
app.use("/api/books",bookRoute);



// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.status || 500;
    const message = err.message || "Something went wrong";
    return res.status(statusCode).json({
      success: [200, 201, 204].some(a => a === err.status) ? true : false,
      status: statusCode,
      message: message,
      data: err.data,
      stack: err.stack
    });
  });
  




const connectMongoDB = async ()=>{
    try{
        await mongoose.connect("mongodb://localhost:27017/AuthDB");
        if(process.argv.includes("--seed")) {
          await seedBooksData();
        }      
        console.log("connected to database")
    }catch(error){
      throw error;
    }
}


app.listen(PORT, () => {
    connectMongoDB();
console.log(`Running express server on Port ${PORT}`)});