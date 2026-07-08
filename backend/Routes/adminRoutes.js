import express from "express";
import jwt from "jsonwebtoken";
import regmodel from "../models/Regristion.js";

const router = express.Router();

// CHECK ADMIN
router.get("/isadmin", async (req, res) => {
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

export default router;