import Project from "../models/Project.js";
import logger from "../config/logger.js";

export const createProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, description, color } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Project name is required"
      });
    }

    const project = await Project.create({
      name,
      description,
      color,
      owner: userId,
      members: [userId]
    });

    return res.status(201).json({
      success: true,
      data: project
    });
  } catch (err) {
    logger.error(err.message);
    return res.status(500).json({
      success: false,
      message: "Error creating project"
    });
  }
};

export const getProjects = async (req, res) => {
  try {
    const userId = req.user.id;

    const projects = await Project.find({
      $or: [
        { owner: userId },
        { members: userId }
      ]
    }).populate("owner", "name");

    return res.json({
      success: true,
      data: projects
    });
  } catch (err) {
    logger.error(err.message);
    return res.status(500).json({
      success: false,
      message: "Error fetching projects"
    });
  }
};

export const addMember = async (req, res) => {
  try {
    const userId = req.user.id;
    const { projectId, memberId } = req.body;

    if (!projectId || !memberId) {
      return res.status(400).json({
        success: false,
        message: "projectId and memberId are required"
      });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    if (project.owner.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Only owner can add members"
      });
    }

    if (project.members.includes(memberId)) {
      return res.status(400).json({
        success: false,
        message: "User already a member"
      });
    }

    project.members.push(memberId);
    await project.save();

    return res.json({
      success: true,
      data: project
    });
  } catch (err) {
    logger.error(err.message);
    return res.status(500).json({
      success: false,
      message: "Error adding member"
    });
  }
};