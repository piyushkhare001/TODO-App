
import mongoose from "mongoose";
import { ROLES } from "../const/global.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.MEMBER
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);