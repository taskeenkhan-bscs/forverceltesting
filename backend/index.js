import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import ProjectForm from "./models/Projectform.js";
import dbconnection from "./dbconnection.js";
import upload from "../backend/Middlewares/multermiddlewares.js"
import Membermodel from "./models/Createmember.js";
import regmodel from "../backend/models/Regristion.js";
import Task from "../backend/models/Taskmodel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser";
import { Adminmiddleware } from "./Forauthmiddleware/Adminmiddleware.js";
import dotenv, { config } from "dotenv";



dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

dbconnection();



// Test Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend is running successfully 🚀",
  });
});

// Test API
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Test API is working!",
    time: new Date().toISOString(),
  });
});

// Your other routes...



// CREATE PROJECT
app.post("/createform", Adminmiddleware, upload.single("picture"), async (req, res) => {
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

    // ================= RESPONSE =================

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

});

// GET
app.get("/projects", Adminmiddleware, async (req, res) => {
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

//create for registrion 
app.post("/register", async (req, res) => {
  try {
    console.log("THe sapi ias hitted")
    const { name, email, password, role, cnic, age, address } = req.body;

    const hashpassword = await bcrypt.hash(password, 10);

    const user = await regmodel.create({
      name,
      email,
      password: hashpassword,
      role,
      cnic,
      age,
      address,
    });

    const jwthash = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET
    );

    res.cookie("token", jwthash, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    res.status(201).json({
      success: true,
      message: "User saved successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// Create Member
app.post("/createmember", upload.single("profilePicture"), async (req, res) => {
  try {
    let body = req.body;

    // file check
    let profilePicture = req.file ? req.file.path : null;

    // add file path into body
    body.profilePicture = profilePicture;

    const data = await Membermodel.create(body);

    res.status(201).json({
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


//for login
app.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await regmodel.findOne({
      email,
      role,
    });

    if (!user) {
      return res.json({
        success: false,
        message: "Invalid email or role",
      });
    }

    const result = await bcrypt.compare(
      password,
      user.password
    );

    if (!result) {
      return res.json({
        success: false,
        message: "Password not matched",
      });
    }


    const jwthash = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET
    );

    res.cookie("token", jwthash, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    res.json({
      success: true,
      message: "Login successful",
      user,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// for member to get 
app.get("/getmember", async (req, res) => {
  try {
    const members = await Membermodel.find();

    res.json({
      success: true,
      count: members.length,
      msg: "getting all member",
      data: members,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// for admin side delete by id 

app.delete("/deletemember", async (req, res) => {

  let id = req.body.id;

  let data = await Membermodel.findOneAndDelete({
    _id: id
  })

  res.json({
    success: true,
    data
  })

})



//for project qeleteim admin side

app.post("/delete", async (req, res) => {
  try {
    console.log(req.body);   // check if id is coming

    const { id } = req.body;

    const result = await ProjectForm.findByIdAndDelete(id);

    console.log(result);

    res.json({
      success: true,
      msg: "Product deleted successfully",
      data: result
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      msg: "Error deleting product",
      error: error.message
    });
  }
});


// for selecting single member by id  

app.get("/getsinglemember/:id", async (req, res) => {

  try {

    let id = req.params.id;

    let data = await Membermodel.findById(id);

    res.json({
      success: true,
      data
    });

  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }

});



//member update by id

app.post("/updatemember", upload.single("profilePicture"), async (req, res) => {

  try {

    let { _id, ...updatedData } = req.body;

    let data = await Membermodel.findOneAndUpdate(
      { _id: _id },
      { $set: updatedData },
      { new: true }
    );

    res.json({
      success: true,
      message: "Member updated successfully",
      data
    });

  } catch (error) {

    res.json({
      success: false,
      message: error.message
    });

  }

});


// for project - single project select for update (admin side) 

app.post("/modernproject", async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res.json({
        success: false,
        message: "ID missing",
      });
    }

    let project = await ProjectForm.findOne({ _id }).populate("member");

    if (!project) {
      return res.json({
        success: false,
        message: "Project not found",
      });
    }

    res.json({
      success: true,
      project: project,
    });

  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
});

// for clcik on updsate code the updsate  

app.post("/updateproject", async (req, res) => {
  try {
    const { _id, title, description, category, priority, status, deadline, member } = req.body;
    let updated = await ProjectForm.findByIdAndUpdate(
      _id,
      { title, description, category, priority, status, deadline, member },
      { new: true }
    );
    res.json({ success: true, project: updated });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// for add task ......
app.post("/addtask", async (req, res) => {
  try {
    console.log(req.body);

    const task = await Task.create(req.body);

    res.status(201).send({
      success: true,
      task,
    });
  } catch (err) {
    console.log("ERROR =", err);

    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
});

app.get("/gettasks/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;

    const tasks = await Task.find({
      projectId: projectId,
    }).populate("assignedTo", "fullName");

    res.status(200).send({
      success: true,
      totalTasks: tasks.length,
      tasks,
    });
  } catch (err) {
    console.log("ERROR =", err);

    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
});

app.get("/isadmin", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.json({
        success: false,
        msg: "Token not found",
      });
    }

    const data = jwt.verify(token, process.env.JWT_SECRET);

    const existingAdmin = await regmodel.findById(data._id);

    if (!existingAdmin) {
      return res.json({
        success: false,
        msg: "User not found",
      });
    }

    if (existingAdmin.role !== "admin") {
      return res.json({
        success: false,
        msg: "Access denied",
      });
    }

    return res.json({
      success: true,
      msg: "Admin verified",
      user: existingAdmin,
    });

  } catch (error) {
    return res.status(401).json({
      success: false,
      msg: "Invalid token",
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server Running On Port ${PORT}`);
});

