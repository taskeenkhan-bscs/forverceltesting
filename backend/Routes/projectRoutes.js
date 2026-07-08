import express from "express";
import ProjectForm from "../models/Projectform.js";
import upload from "../Middlewares/multermiddlewares.js";
import { Adminmiddleware } from "../Forauthmiddleware/Adminmiddleware.js";

const router = express.Router();

// CREATE PROJECT
router.post(
  "/createform",
  Adminmiddleware,
  upload.single("picture"),
  async (req, res) => {
    try {
      const data = await ProjectForm.create({
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        priority: req.body.priority,
        deadline: req.body.deadline,
        status: req.body.status,
        member: req.body.member,
        picture: req.file.path,
      });

      res.json({
        success: true,
        message: "Project Created Successfully",
        data,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// GET ALL PROJECTS
router.get("/", Adminmiddleware, async (req, res) => {
  try {
    const data = await ProjectForm.find().populate("member");

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});



// DELETE PROJECT
router.post("/delete", async (req, res) => {
  try {
    const { id } = req.body;

    const result = await ProjectForm.findByIdAndDelete(id);

    res.json({
      success: true,
      msg: "Project deleted successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      msg: "Error deleting project",
      error: error.message,
    });
  }
});

// GET SINGLE PROJECT
router.post("/modernproject", async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res.json({
        success: false,
        message: "ID missing",
      });
    }

    const project = await ProjectForm.findOne({ _id }).populate("member");

    if (!project) {
      return res.json({
        success: false,
        message: "Project not found",
      });
    }

    res.json({
      success: true,
      project,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
});

// UPDATE PROJECT
router.post("/updateproject", async (req, res) => {
  try {
    const {
      _id,
      title,
      description,
      category,
      priority,
      status,
      deadline,
      member,
    } = req.body;

    const updated = await ProjectForm.findByIdAndUpdate(
      _id,
      {
        title,
        description,
        category,
        priority,
        status,
        deadline,
        member,
      },
      { new: true }
    );

    res.json({
      success: true,
      project: updated,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
});

export default router;