import mongoose from "mongoose";
import { env } from "./env.js";
import logger from "./logger.js";

const connectDB = async () => {
  try {
    if (!env.DB_URL) {
      ("DB_URL is missing in .env");
    }
    await mongoose.connect(env.DB_URL);
    logger.info("MongoDB Connected 🚀");
  } catch (error) {
    logger.error("DB Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
