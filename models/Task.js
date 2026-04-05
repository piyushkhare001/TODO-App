import mongoose from "mongoose";
import { TASK_STATUS, PRIORITY } from "../const/global.js";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    status: {
      type: String,
      enum: Object.values(TASK_STATUS),
      default: TASK_STATUS.TODO,
    },

    priority: {
      type: String,
      enum: Object.values(PRIORITY),
      default: PRIORITY.MEDIUM,
    },

    dueDate: {
      type: Date,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    tags: [
      {
        type: String,
      },
    ],

    attachments: [
      {
        type: String,
      },
    ],

    checklist: [
      {
        text: String,
        completed: {
          type: Boolean,
          default: false,
        },
      },
    ],

    position: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Task", taskSchema);
