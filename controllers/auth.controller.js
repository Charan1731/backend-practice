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

        if (!name || !email || !password) {
            const error = new Error('All fields are required');
            error.statusCode = 400;
            throw error;
        }

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
            token,
            user: {
                _id: newUser[0]._id,
                name: newUser[0].name,
                email: newUser[0].email
            }
        })
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}

export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            const error = new Error('Email and password are required');
            error.statusCode = 400;
            throw error;
        }

        const user = await User.findOne({ email });

        if(!user) {
            const error = new Error('Invalid credentials');
            error.statusCode = 401;
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
            const error = new Error('Invalid credentials');
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
        res.status(200).json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        next(error);
    }
}

export const signOut = async(req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            message: 'Signed out successfully'
        });
    } catch (error) {
        next(error);
    }
}