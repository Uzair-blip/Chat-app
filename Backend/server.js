import "dotenv/config.js";
import http from "http";
import app from "./app.js";
import connectDB from "./db/db.js";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import projectModel from "./models/project.model.js";
import { generateResult } from "./services/ai.service.js";
import mongoose from "mongoose";

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Use specific origins in production
  },
});

// Middleware for authentication
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    const projectId = socket.handshake.query.projectId;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      throw new Error("Invalid project ID");
    }

    const project = await projectModel.findById(projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      throw new Error("Authorization error");
    }

    socket.project = project;
    socket.user = decoded;
    next();
  } catch (err) {
    next(err);
  }
});

// Event listeners
io.on("connection", (socket) => {
  socket.join(socket.project._id.toString());

  console.log(`User connected: ${socket.user._id}`);

  socket.on("project-msg", async (data) => {
    const message = data.message;
    const aiMessage = message.includes("@ai");
    socket.to(socket.project._id.toString()).emit("project-msg", data);
    if (aiMessage) {
      const prompt = message.replace("@ai", "");
      const result = await generateResult(prompt);

      io.to(socket.project._id.toString()).emit("project-msg", {
        message: result,
        sender: { _id: "ai", email: "AI" },
      });
    }
  });
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.user._id}`);
    socket.leave(socket.project._id.toString());
  });
});

// Connect to MongoDB
connectDB();

server.listen(process.env.PORT || 4000, () => {
  console.log("Server is running");
});
