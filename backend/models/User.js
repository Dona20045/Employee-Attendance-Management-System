import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["employee", "hr"],
      default: "employee"
    },

    employeeId: {
      type: String,
      unique: true,
      sparse: true
    },

    department: {
      type: String,
      default: "General"
    },

    designation: {
      type: String,
      default: "Employee"
    },

    monthlySalary: {
      type: Number,
      default: 30000,
      min: 0
    },

    joiningDate: {
      type: Date,
      default: Date.now
    },

    leaveBalance: {
      type: Number,
      default: 12,
      min: 0
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("User", userSchema);