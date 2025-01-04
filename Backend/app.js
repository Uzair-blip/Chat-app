import express from "express";
import morgan from "morgan";
const app = express();
import userRoutes from "./routes/user.routes.js"

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//user routes
app.use("/user",userRoutes)

// Routes
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

export default app;
