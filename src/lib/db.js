import mongoose from 'mongoose';
import "dotenv/config";

export const connectDB = async () => {


    try {

      const conn =  await mongoose.connect(process.env.mongodb_uri);
      console.log(`database connnected ${conn.connection.host}`);
        
    } catch (error) {
        console.log("error connecting to db: ",error);
        process.exit(1);
    }

}