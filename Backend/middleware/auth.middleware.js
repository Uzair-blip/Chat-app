import userModel from "../models/user.model.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

export const authUser = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1] || (req.cookies && req.cookies.token);

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // This will decode token
        const user = await userModel.findById(decoded._id);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" }); // Add return here
        }
        
        req.user = user;
        return next(); // Call next middleware only once
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" }); // Add return here to prevent further execution
    }
};