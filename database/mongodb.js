import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js";

if(!DB_URI){
    throw new Error("Pass the mondodb url")
}

const connectToDatabase = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log(`Connected to database ${NODE_ENV} `)
    } catch (error) {
        console.log(error)
    }
}

export default connectToDatabase