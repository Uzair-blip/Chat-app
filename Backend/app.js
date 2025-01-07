import express from "express";
import morgan from "morgan";
const app = express();
import userRoutes from "./routes/user.routes.js"
import projectRoutes from "./routes/project.routes.js"
import cors from "cors"

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from this origin
  methods: 'GET,POST,PUT,DELETE',
  credentials: true,
}));
//user routes
app.use("/user",userRoutes)
app.use("/project",projectRoutes)

// Routes
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

export default app;
