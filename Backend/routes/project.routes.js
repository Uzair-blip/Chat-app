import { Router } from "express";
import {body} from "express-validator"
import * as projectController from "../controllers/project.controller.js"
import *as authmiddleware from "../middleware/auth.middleware.js";
const router = Router();

router.post(
    "/create",authmiddleware.authUser,
        body("name").notEmpty().withMessage("Project name is required"),
    projectController.createProject
);
router.get("/all",
    authmiddleware.authUser,
    projectController.getAllProjects
)
router.put(
    "/adduser",
    authmiddleware.authUser,
    body("projectId").isString().withMessage("Project ID is required"),
    body("users")
        .custom((value) => Array.isArray(value) || typeof value === "string")
        .withMessage("Users must be a string or an array"),
    projectController.addUserToProject
);
router.get("/get-project/:projectId",
    authmiddleware.authUser,
    projectController.getProjectById
)


export default router;

