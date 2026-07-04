
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "Todo",
        "In Progress",
        "In Review",
        "Done",
      ],
      default: "Todo",
    },

    priority: {
      type: String,
      enum: [
        "Low",
        "Medium",
        "High",
        "Urgent",
      ],
      default: "Medium",
    },

    deadline: {
      type: Date,
      default: null,
    },

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProjectForm",
      required: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      default: null,
    },

  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Task", taskSchema);
