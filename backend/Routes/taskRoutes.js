import express from "express";
import Task from "../models/Taskmodel.js";

const router = express.Router();

// ADD TASK
router.post("/add", async (req, res) => {
  try {
    console.log(req.body);

    const task = await Task.create(req.body);

    res.status(201).json({
      success: true,
      task,
    });
  } catch (err) {
    console.log("ERROR =", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// GET TASKS OF A PROJECT
router.get("/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;

    const tasks = await Task.find({
      projectId,
    }).populate("assignedTo", "fullName");

    res.status(200).json({
      success: true,
      totalTasks: tasks.length,
      tasks,
    });
  } catch (err) {
    console.log("ERROR =", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;