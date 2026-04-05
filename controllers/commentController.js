import Comment from "../models/Comment.js";
import Task from "../models/Task.js";
import Project from "../models/Project.js";
import logger from "../config/logger.js";

export const addComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { text, taskId } = req.body;

    if (!text || !taskId) {
      return res.status(400).json({
        success: false,
        message: "Text and taskId are required"
      });
    }

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    const project = await Project.findById(task.project);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    const isMember =
      project.owner.toString() === userId ||
      project.members.some(m => m.toString() === userId);

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "Not authorized"
      });
    }

    const comment = await Comment.create({
      text,
      task: taskId,
      user: userId
    });

    return res.status(201).json({
      success: true,
      data: comment
    });
  } catch (err) {
    logger.error(err.message);
    return res.status(500).json({
      success: false,
      message: "Error adding comment"
    });
  }
};

export const getComments = async (req, res) => {
  try {
    const userId = req.user.id;
    const { taskId } = req.params;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    const project = await Project.findById(task.project);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    const isMember =
      project.owner.toString() === userId ||
      project.members.some(m => m.toString() === userId);

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "Not authorized"
      });
    }

    const comments = await Comment.find({ task: taskId })
      .populate("user", "name email");

    return res.json({
      success: true,
      data: comments
    });
  } catch (err) {
    logger.error(err.message);
    return res.status(500).json({
      success: false,
      message: "Error fetching comments"
    });
  }
};