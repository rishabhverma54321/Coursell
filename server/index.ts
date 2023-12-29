import express from "express";
import mongoose from "mongoose";
import userRoute from "./routes/user";
import adminRoute from "./routes/admin";
import cors from 'cors'
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 3001;
const DB_CONNECT:string = process.env.DATABASE_URL || ""
console.log("dbconnect", DB_CONNECT)


const app = express();

app.use(express.json()); 
app.use(cors())
app.use("/users",userRoute)
app.use("/admin",adminRoute)

mongoose.connect(DB_CONNECT, { dbName: "courses" });
app.listen(PORT, ()=>{
    console.log(`listening on port ${PORT}`)
})



