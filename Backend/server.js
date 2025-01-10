import "dotenv/config.js"; // Load .env variables
import http from "http";
import app from "./app.js";
import connectDB from "./db/db.js";
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import jwt from "jsonwebtoken"
import projectModel from "./models/project.model.js";
import mongoose from "mongoose"
app.use(cookieParser());
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = new Server(server,{
  cors:{
    origin:"*"
  }
});

//io middleware jo sirf authenticated user ko e connect krny dygi
io.use(async(socket, next) => {
  try {
    let token = socket.handshake.auth.token;
    const projectId=socket.handshake.query.projectId  
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      throw new Error('Invalid project ID');
    }
    socket.project=await projectModel.findById(projectId)  //jis b prject k sth connect hongy uski id socket.project me ajaye gi 
    if (!token) {
      let authHeader = socket.handshake.headers.authorization;
      if (!authHeader) {
        throw new Error('Authentication error');
      }
      token = authHeader.split(' ')[1];
    }
    // Verify the token using JWT
    const decoded= jwt.verify(token, process.env.JWT_SECRET)
     if(!decoded){
      return next(new Error("Authorization error "))
     }
     socket.user=decoded
     next()
  } catch (error) {
    next(error);
  }
});
// Connect to MongoDB
connectDB();
io.on('connection', (socket) => {
  socket.roomID = socket.project._id.toString();
  console.log("User connected:", socket.user);

  // Join the room
  socket.join(socket.roomID);

  // Listen for messages and broadcast them only to others in the same room
  socket.on('project-msg', (data) => {
    socket.to(socket.roomID).emit('project-msg', data); // Broadcast to everyone except sender
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log("User disconnected:", socket.user);
    socket.leave(socket.roomID)
  });
});




server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


//mongodb data ko store krta a harddisk me
// redis data ko store krta RAM me uski wja sy reading or writing speed zyada hti a  