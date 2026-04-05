import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import logger from "./config/logger.js";
import { env } from "./config/env.js";

import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();


const allowedOrigins =
  process.env.NODE_ENV === "development"
    ? ["http://localhost:5173"]
    : [env.CLIENT_URL];

app.use(
  cors({
    origin: (origin, callback) => {
      logger.info(`Incoming origin: ${origin}`);

      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      logger.error(`CORS blocked for origin: ${origin}`);
      return callback(null, false);
    },
    credentials: true,
  })
);

app.options("/*", cors());


app.use(express.json());


connectDB();


app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/users", userRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});