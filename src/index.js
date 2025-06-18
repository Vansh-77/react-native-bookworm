import express from 'express';
import "dotenv/config";
import cors from 'cors';
import job from './lib/cron.js';
import AuthRoutes from "./routes/AuthRoutes.js"
import BookRoutes from "./routes/BookRoutes.js"
import { connectDB } from './lib/db.js';


const app = express()

const Port  = process.env.PORT;
app.use(express.json());
app.use(cors());

job.start();

app.get("/",(req,res)=>{
    res.send("Welcome to Bookworm API")
});

app.use("/api/auth",AuthRoutes);
app.use("/api/books",BookRoutes);



app.listen(Port,()=>{
    
    console.log(`server is running on port ${Port}`)
    connectDB();

});