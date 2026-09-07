import Attendance from "../models/Attendance.js";


// Get today's date
const dateKey = () => {
  return new Date()
    .toISOString()
    .slice(0, 10);
};


// Calculate attendance status
const calculateStatus = (
  checkIn,
  workingHours
) => {

  // Less than 4 hours
  if (
    workingHours > 0 &&
    workingHours < 4
  ) {
    return "Half Day";
  }

  const hour =
    new Date(checkIn).getHours();

  const minute =
    new Date(checkIn).getMinutes();

  // Late after 9:15 AM
  if (
    hour > 9 ||
    (hour === 9 && minute > 15)
  ) {
    return "Late";
  }

  return "Present";
};


// CHECK IN
export const checkIn = async (
  req,
  res,
  next
) => {
  try {

    const date = dateKey();

    const existing =
      await Attendance.findOne({
        employee: req.user._id,
        date
      });

    if (existing?.checkIn) {
      return res.status(400).json({
        success: false,
        message: "Already checked in today"
      });
    }

    const attendance =
      existing ||
      new Attendance({
        employee: req.user._id,
        date
      });

    attendance.checkIn = new Date();

    attendance.status =
      calculateStatus(
        attendance.checkIn,
        0
      );

    await attendance.save();

    res.status(201).json({
      success: true,
      attendance
    });

  } catch (error) {
    next(error);
  }
};


// CHECK OUT
export const checkOut = async (
  req,
  res,
  next
) => {
  try {

    const date = dateKey();

    const attendance =
      await Attendance.findOne({
        employee: req.user._id,
        date
      });

    if (!attendance?.checkIn) {
      return res.status(400).json({
        success: false,
        message: "Please check in first"
      });
    }

    if (attendance.checkOut) {
      return res.status(400).json({
        success: false,
        message: "Already checked out today"
      });
    }

    attendance.checkOut =
      new Date();

    attendance.workingHours =
      Number(
        (
          (attendance.checkOut -
            attendance.checkIn) /
          3600000
        ).toFixed(2)
      );

    attendance.status =
      calculateStatus(
        attendance.checkIn,
        attendance.workingHours
      );

    await attendance.save();

    res.json({
      success: true,
      attendance
    });

  } catch (error) {
    next(error);
  }
};


// MY ATTENDANCE
export const myAttendance = async (
  req,
  res,
  next
) => {
  try {

    const records =
      await Attendance.find({
        employee: req.user._id
      }).sort({
        date: -1
      });

    res.json({
      success: true,
      records
    });

  } catch (error) {
    next(error);
  }
};


// TODAY'S ATTENDANCE
export const today = async (
  req,
  res,
  next
) => {
  try {

    const record =
      await Attendance.findOne({
        employee: req.user._id,
        date: dateKey()
      });

    res.json({
      success: true,
      record
    });

  } catch (error) {
    next(error);
  }
};


// ALL ATTENDANCE - HR
export const allAttendance = async (
  req,
  res,
  next
) => {
  try {

    const records =
      await Attendance.find()
        .populate(
          "employee",
          "name employeeId department"
        )
        .sort({
          date: -1
        });

    res.json({
      success: true,
      records
    });

  } catch (error) {
    next(error);
  }
};