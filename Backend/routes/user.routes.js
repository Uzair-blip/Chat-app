import { Router } from "express";
import { register,login, Profile, logout,Allusers } from "../controllers/user.controller.js";
import { check } from "express-validator";
import * as authMiddleware from "../middleware/auth.middleware.js"
const router = Router();

// Add validation for email and password
router.post(  "/register",
    [
        check("email").isEmail().withMessage("Invalid email"),
        check("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    ],
    register
);
router.post("/login", login)
router.get("/",authMiddleware.authUser,Profile)
router.get("/logout",authMiddleware.authUser,logout)
router.get("/allusers",authMiddleware.authUser,Allusers)

export default router;
