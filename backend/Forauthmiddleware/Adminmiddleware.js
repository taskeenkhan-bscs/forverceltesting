import jwt from "jsonwebtoken";
import regmodel from "../models/Regristion.js";
 
export async function Adminmiddleware(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        msg: "Token not found",
      });
    }

const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const existingAdmin = await regmodel.findById(decoded._id);

    if (!existingAdmin) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    if (existingAdmin.role !== "admin") {
      return res.status(403).json({
        success: false,
        msg: "Access Denied: Not Admin",
      });
    }

    // attach user to request (important)
    req.user = existingAdmin;

    next();

  } catch (error) {
    console.log(error.message);

    return res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
}