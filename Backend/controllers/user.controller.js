import { validationResult } from "express-validator";
import userModel from "../models/user.model.js";
import userService from "../services/user.service.js";
import redisClient from "../services/redis.service.js";

const register = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // Hash the password
        const hashedPassword = await userModel.hashPassword(password);

        // Create the user
        const user = await userService.CreateUser({
            email,
            password: hashedPassword,
        });

        // Generate a token
        const token = user.generateAuthtoken();
     delete user._doc.password
     res.json({
        success: true,
        message: "Register successful",
        token,
        user, // Send user data to the client
    }); 

    } catch (error) {
        next(error); // Use centralized error handling
    }
};
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find the user and include password field
        const user = await userModel.findOne({ email }).select('+password');
        if (!user) {
            throw createError(401, "Invalid credentials");
        }

        // Verify password
        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            throw createError(401, "Invalid credentials");
        }

        // Generate token
        const token = user.generateAuthtoken();
        delete user._doc.password;

        res.cookie("token", token); // Optional, for cookie storage

        // Include user object in the response
        res.json({
            success: true,
            message: "Login successful",
            token,
            user, // Send user data to the client
        });
    } catch (error) {
        next(error);
    }
};

const Profile=async (req,res) => {
    res.status(200).json(req.user)
}
const logout = async (req, res, next) => {
    try {
        // Extract token from the Authorization header
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ 
                success: false,
                 message: "No token found" 
                });
        }

        // Add the token to the Redis blacklist
        await redisClient.set(token, 'logout', 'EX', 60 * 60 * 24); // Blacklist token for 24 hours

        // Clear the token cookie
        res.clearCookie('token');

        return res.json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        next(error);
    }
};
const Allusers=async (req,res,next) => {
    try {
        const loggedInUser = await userModel.findOne({
            email:req.user.email
        });
        const allusers=await userService.GetallUser({userId:loggedInUser._id})
        return res.status(200).json({
            users:allusers
        })
    } catch (error) {
        
    }
}
export { register,login,Profile,logout,Allusers};
