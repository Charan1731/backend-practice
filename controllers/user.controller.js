import bcrypt from 'bcryptjs';
import User from "../models/user.model.js";

export const getUsers = async(req,res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({
            sucess:true,
            data:users
        })
    } catch (error) {
        next(error)
    }
}

export const getUser = async(req,res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if(!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            sucess:true,
            data:user
        })
    } catch (error) {
        next(error)
    }
}


export const deleteUser = async(req,res, next) => {
    try {

        const user = await User.findByIdAndDelete(req.params.id);
        if(!user){
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            success:true,
            data:{}
        })
        
    } catch (error) {
        next(error)
    }
}


export const updateUserDetails = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, password } = req.body;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        if (name) {
            user.name = name;
        }
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user.password = hashedPassword;
        }
        await user.save();

        res.status(200).json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
            }
        });
    } catch (e) {
        next(e);
    }
};