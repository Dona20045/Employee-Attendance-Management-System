import User from "../models/User.js";
import Attendance from "../models/Attendance.js";
import Leave from "../models/Leave.js";


// HR DASHBOARD
export const dashboard = async (
  req,
  res,
  next
) => {

  try {

    const today =
      new Date()
        .toISOString()
        .slice(0, 10);

    const [
      employees,
      attendance,
      pendingLeaves,
      approvedLeaves
    ] = await Promise.all([

      User.countDocuments({
        role: "employee",
        isActive: true
      }),

      Attendance.countDocuments({
        date: today
      }),

      Leave.countDocuments({
        status: "Pending"
      }),

      Leave.countDocuments({
        status: "Approved"
      })

    ]);

    const presentToday =
      await Attendance.countDocuments({
        date: today,
        status: {
          $in: [
            "Present",
            "Late"
          ]
        }
      });

    res.json({
      success: true,

      stats: {
        employees,
        attendance,
        presentToday,
        pendingLeaves,
        approvedLeaves
      }
    });

  } catch (error) {
    next(error);
  }
};


// GET EMPLOYEES
export const employees = async (
  req,
  res,
  next
) => {

  try {

    const data =
      await User.find({
        role: "employee"
      })
        .select("-password")
        .sort({
          createdAt: -1
        });

    res.json({
      success: true,
      employees: data
    });

  } catch (error) {
    next(error);
  }
};


// ACTIVATE / DEACTIVATE EMPLOYEE
export const updateEmployeeStatus =
  async (req, res, next) => {

    try {

      const user =
        await User.findOne({
          _id: req.params.id,
          role: "employee"
        });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Employee not found"
        });
      }

      user.isActive =
        Boolean(req.body.isActive);

      await user.save();

      res.json({
        success: true,
        message:
          "Employee status updated",
        isActive: user.isActive
      });

    } catch (error) {
      next(error);
    }
  };