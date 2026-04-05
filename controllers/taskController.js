import Task from "../models/Task.js";
import Project from "../models/Project.js";
import logger from "../config/logger.js";

export const createTask = async (req, res) => {
  try {
    const userId = req.user.id;

    const { title, description, priority, dueDate, assignedTo, project } =
      req.body;

    if (!title || !project) {
      return res.status(400).json({
        success: false,
        message: "Title and project are required",
      });
    }

    const projectData = await Project.findById(project);

    if (!projectData) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const isMember =
      projectData.owner.toString() === userId ||
      projectData.members.some((m) => m.toString() === userId);

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      project,
    });
    if (assignedTo) {
      await Project.findByIdAndUpdate(project, {
        $addToSet: { members: assignedTo }, // prevents duplicates
      });
    }
    return res.status(201).json({
      success: true,
      data: task,
    });
  } catch (err) {
    logger.error(err.message);
    return res.status(500).json({
      success: false,
      message: "Error creating task",
    });
  }
};

export const getTasks = async (req, res) => {
  try {
    const userId = req.user.id;

    const projects = await Project.find({
      $or: [{ owner: userId }, { members: userId }],
    }).select("_id");

    const projectIds = projects.map((p) => p._id);

    const tasks = await Task.find({
      $or: [
        { project: { $in: projectIds } }, // tasks in user's projects
        { assignedTo: userId }, // tasks assigned to user
      ],
    })
      .populate("assignedTo", "name email")
      .populate("project", "owner name")

    return res.json({
      success: true,
      data: tasks,
    });
  } catch (err) {
    logger.error(err.message);
    return res.status(500).json({
      success: false,
      message: "Error fetching tasks",
    });
  }
};

export const updateTask = async (req, res) => {
  try {
    const userId = req.user.id;

    const task = await Task.findById(req.params.id).populate("project");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }
    const isOwner = task.project.owner.toString() === userId;

    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: "Only project owner can update tasks",
      });
    }
    const isMember =
      task.project.owner.toString() === userId ||
      task.project.members.some((m) => m.toString() === userId);

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

 const updateData = { ...req.body };

if (!updateData.assignedTo) {
  delete updateData.assignedTo;
}

const updated = await Task.findByIdAndUpdate(
  req.params.id,
  updateData,
  { new: true }
)
  .populate("assignedTo", "name email")
  .populate("project", "name owner");
    if (req.body.assignedTo) {
      await Project.findByIdAndUpdate(updated.project, {
        $addToSet: { members: req.body.assignedTo },
      });
    }
    return res.json({
      success: true,
      data: updated,
    });
  } catch (err) {
    logger.error(err.message);
    return res.status(500).json({
      success: false,
      message: "Error updating task",
    });
  }
};
