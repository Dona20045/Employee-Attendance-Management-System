import Leave from "../models/Leave.js";
import User from "../models/User.js";


// Calculate number of days
const dayDiffInclusive = (
  start,
  end
) => {

  const a =
    new Date(`${start}T00:00:00`);

  const b =
    new Date(`${end}T00:00:00`);

  return (
    Math.floor(
      (b - a) / 86400000
    ) + 1
  );
};


// CREATE LEAVE
export const createLeave = async (
  req,
  res,
  next
) => {
  try {

    const {
      startDate,
      endDate,
      reason,
      type
    } = req.body;

    if (
      !startDate ||
      !endDate ||
      !reason
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Start date, end date and reason are required"
      });
    }

    const days =
      dayDiffInclusive(
        startDate,
        endDate
      );

    if (days < 1) {
      return res.status(400).json({
        success: false,
        message:
          "End date must be after or equal to start date"
      });
    }

    const dailySalary =
      (req.user.monthlySalary || 0) /
      30;

    const deduction =
      type === "Unpaid"
        ? Number(
            (days * dailySalary)
              .toFixed(2)
          )
        : 0;

    const leave =
      await Leave.create({
        employee: req.user._id,
        startDate,
        endDate,
        days,
        reason,
        type: type || "Casual",
        deduction
      });

    res.status(201).json({
      success: true,
      leave
    });

  } catch (error) {
    next(error);
  }
};


// MY LEAVES
export const myLeaves = async (
  req,
  res,
  next
) => {
  try {

    const leaves =
      await Leave.find({
        employee: req.user._id
      }).sort({
        createdAt: -1
      });

    res.json({
      success: true,
      leaves
    });

  } catch (error) {
    next(error);
  }
};


// ALL LEAVES - HR
export const allLeaves = async (
  req,
  res,
  next
) => {
  try {

    const leaves =
      await Leave.find()
        .populate(
          "employee",
          "name employeeId department monthlySalary"
        )
        .sort({
          createdAt: -1
        });

    res.json({
      success: true,
      leaves
    });

  } catch (error) {
    next(error);
  }
};


// APPROVE / REJECT
export const updateLeaveStatus =
  async (req, res, next) => {

    try {

      const { status } =
        req.body;

      if (
        !["Approved", "Rejected"]
          .includes(status)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid leave status"
        });
      }

      const leave =
        await Leave.findById(
          req.params.id
        ).populate("employee");

      if (!leave) {
        return res.status(404).json({
          success: false,
          message: "Leave not found"
        });
      }

      if (
        leave.status === "Approved"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Approved leave cannot be changed"
        });
      }


      // Deduct leave balance
      if (
        status === "Approved" &&
        leave.type !== "Unpaid"
      ) {

        const employee =
          await User.findById(
            leave.employee._id
          );

        if (
          employee.leaveBalance <
          leave.days
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Insufficient leave balance"
          });
        }

        employee.leaveBalance -=
          leave.days;

        await employee.save();
      }

      leave.status = status;

      await leave.save();

      res.json({
        success: true,
        leave
      });

    } catch (error) {
      next(error);
    }
  };