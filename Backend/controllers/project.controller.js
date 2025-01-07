import * as ProjectService from "../services/project.service.js";
//creating a project
const createProject = async (req, res) => {
    try {
        const { name } = req.body;

        // Get the logged-in user from the `authUser` middleware
        const loggedInUser = req.user;

        if (!loggedInUser) {
            throw new Error("User is not authenticated");
        }

        const userId = loggedInUser._id;

        // Create a new project
        const newProject = await ProjectService.createProject({ name, userId });

        res.status(201).json(newProject);
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
//display all projects that user belongs 
const getAllProjects = async (req, res) => {
    try {
        // Get the logged-in user from the `authUser` middleware
        const loggedInUser = req.user;
        if (!loggedInUser) {
            return res.status(401).json({
                success: false,
                message: "User is not authenticated"
            });
        }
        const userId = loggedInUser._id;
        
        const getallProjects = await ProjectService.getAllProjectsByUserId(userId);
     
        console.log(getallProjects)
        res.status(200).json({
            projects:getallProjects
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error in getting all projects"
        });
    }
}
// add user to specific project
const addUserToProject = async (req, res) => {
    try {
        const { projectId, users } = req.body;
        console.log(req.body);
        // Ensure `users` is an array
        const userArray = Array.isArray(users) ? users : [users];

        const loggedInUser = req.user;
        if (!loggedInUser) {
            return res.status(401).json({
                success: false,
                message: "User is not authenticated",
            });
        }
        const userId = loggedInUser._id;

        const project = await ProjectService.addUsersToProject({
            projectId,
            users: userArray,
            userId,
        });

        res.status(200).json({
            success: true,
            project,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message || "Error in adding users to project",
        });
    }
};
const getProjectById=async(req,res)=>{
const {projectId}=req.params
try {

    const project=await ProjectService.getProjectId({projectId})
    res.status(200).json({
        success: true,
        project
    });
} catch (error) {
    
    console.error(error);
    res.status(500).json({
        success: false,
        message: error.message || "Error in getting project",
    });
    
}
}

export { createProject,getAllProjects,addUserToProject,getProjectById };