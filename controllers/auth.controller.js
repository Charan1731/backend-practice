import { mongoose } from "mongoose"
import bcrypt from "bcryptjs"
import User from "../models/user.model.js"
import jwt from "jsonwebtoken"
import { JWT_EXPIRES, JWT_SECRET } from "../config/env.js";


export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        
        const {name, email, password} = req.body

        const existingUserEmail = await User.findOne({email})
        const existingUserName = await User.findOne({name})
        if(existingUserEmail){
            const error = new Error('User already exists');
            error.statusCode = 409;
            throw error;
        }

        if(existingUserName){
            const error = new Error("Username already exists")
            error.statusCode = 409;
            throw error
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create([{
            name,
            email,
            password: hashedPassword
        }], {session})

        const token = jwt.sign({userId: newUser[0]._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES})

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            sucess:true,
            message:`User created successfully`,
            data:{
                token,
                user: newUser[0]
            }
        })
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}

export const signIn = async(req, res, next) => {
    
}

export const signOut = async(req, res, next) => {

}