import userModel from "../models/user.model.js"
import jwt from "jsonwebtoken"
import redisClient from "../services/redis.service.js";
export const authUser = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1] || req.cookies?.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        // Check if the token is blacklisted in Redis
        const isBlacklisted = await redisClient.get(token);
        if (isBlacklisted) {
            res.clearCookie('token'); // Clear the token cookie
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Verify the token and decode it
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded._id);

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        req.user = user;
        next(); // Proceed to the next middleware
    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
};
