import projectModel from "../models/project.model.js"
import mongoose from "mongoose";
export const createProject=async ({
    name,userId
}) => {
    if(!name){
        throw new Error ("Name is required ")
    }
    if(!userId){
        throw new Error ("User is required ")
    }
    // Check if project with same name already exists
    const existingProject = await projectModel.findOne({ name });
    if (existingProject) {
        throw new Error("A project with this name already exists");
    }

    try {
        const project = await projectModel.create({
            name,
           users:[userId] ,
           
        })
        
        return project
    } catch (error) {
        throw new Error("Error creating project: " + error.message)
    }
}
export const getAllProjectsByUserId = async (userId) => {
    if (!userId) {
        throw new Error("User ID is required");
    }

    try {
        const getAllProjects = await projectModel.find({
            users: userId
        });
        return getAllProjects;
    } catch (error) {
        throw new Error("Error fetching projects: " + error.message);
    }
}

export const addUsersToProject = async ({ users, projectId, userId }) => {
    if (!users || !Array.isArray(users)) {
        throw new Error("Users must be a valid array");
    }
    if (!projectId) {
        throw new Error("Project ID is required");
    }

    try {
        // Check if project exists
        const project = await projectModel.findById(projectId);
        if (!project) {
            throw new Error("Project not found");
        }

        // Verify that the user making the request is a member of the project
        if (!project.users.includes(userId)) {
            throw new Error("You don't have permission to add users to this project");
        }

        // Ensure users are ObjectIds
        const usersToAdd = users.map((user) => new mongoose.Types.ObjectId(user));

        // Update the project document
        const updatedProject = await projectModel.findByIdAndUpdate(
            projectId,
            { $addToSet: { users: { $each: usersToAdd } } },
            { new: true }
        );

        return updatedProject;
    } catch (error) {
        throw new Error("Error adding users to project: " + error.message);
    }
};

export const getProjectId = async ({ projectId }) => {
    if (!projectId) {
        throw new Error("Project ID is required");
    }

    try {
        const project = await projectModel.findOne({ _id: projectId }).populate("users");
        if (!project) {
            throw new Error("Project not found");
        }
        return project;
    } catch (err) {
        console.error("Error in getProjectById:", err.message);
        throw new Error("Failed to fetch project");
    }
};
