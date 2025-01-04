import "dotenv/config.js"; // Load .env variables
import http from "http";
import app from "./app.js";
import connectDB from "./db/db.js";
import cookieParser from 'cookie-parser';
app.use(cookieParser());
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
