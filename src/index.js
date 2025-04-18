import express from 'express';
import "dotenv/config";
import AuthRoutes from "./routes/AuthRoutes.js"
import BookRoutes from "./routes/BookRoutes.js"
import { connectDB } from './lib/db.js';


const app = express()

const Port  = process.env.PORT;
app.use(express.json());

app.use("/api/auth",AuthRoutes);
app.use("/api/books",BookRoutes);



app.listen(Port,()=>{
    
    console.log(`server is running on port ${Port}`)
    connectDB();

});