
import mongoose from "mongoose";
import { mongoURL } from "./config.js";

export const connectDB = async () => {
    try{
        await mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("MongoDB is connected successfully");
    }catch(error){
        console.error("Error in MongoDB connection: ", error);
    }
}