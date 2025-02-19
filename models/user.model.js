import mongoose from "mongoose";

const userScheme = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minLength: 2,
        maxLenght: 50,
        index:true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Please enter a valid Email ID'],
        index: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength:6,
        index: true
    }
},{timestamps:true})

const User = mongoose.model('User', userScheme)

export default User