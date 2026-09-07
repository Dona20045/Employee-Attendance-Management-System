import bcrypt from "bcryptjs";
import User from "../models/User.js";

import {
  setAuthCookie,
  signToken
} from "../utils/auth.js";

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  employeeId: user.employeeId,
  department: user.department,
  designation: user.designation,
  monthlySalary: user.monthlySalary,
  leaveBalance: user.leaveBalance,
  joiningDate: user.joiningDate,
  isActive: user.isActive
});


// REGISTER
export const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      department,
      designation,
      monthlySalary
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters"
      });
    }

    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Email already registered"
      });
    }

    const count = await User.countDocuments({
      role: "employee"
    });

    const employeeId =
      `EMP${String(count + 1).padStart(4, "0")}`;

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "employee",
      employeeId,
      department: department || "General",
      designation: designation || "Employee",
      monthlySalary:
        Number(monthlySalary) || 30000
    });

    const token = signToken(user);

    setAuthCookie(res, token);

    res.status(201).json({
      success: true,
      user: publicUser(user)
    });

  } catch (error) {
    next(error);
  }
};


// LOGIN
export const login = async (req, res, next) => {
  try {
    const {
      email,
      password
    } = req.body;

    const user = await User.findOne({ email });

    if (
      !user ||
      !(await bcrypt.compare(
        password || "",
        user.password
      ))
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is inactive"
      });
    }

    const token = signToken(user);

    setAuthCookie(res, token);

    res.json({
      success: true,
      user: publicUser(user)
    });

  } catch (error) {
    next(error);
  }
};


// LOGOUT
export const logout = (req, res) => {
  res.clearCookie("token");

  res.json({
    success: true,
    message: "Logged out"
  });
};


// CURRENT USER
export const me = async (req, res) => {
  res.json({
    success: true,
    user: publicUser(req.user)
  });
};