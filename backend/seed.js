import dotenv from "dotenv";

dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import User from "./models/User.js";


await mongoose.connect(
  process.env.MONGO_URI
);


const email =
  "hr@example.com";

const password =
  "Hr@12345";


const exists =
  await User.findOne({ email });


if (!exists) {

  await User.create({

    name: "HR Manager",

    email,

    password:
      await bcrypt.hash(
        password,
        10
      ),

    role: "hr",

    employeeId:
      "HR0001",

    department:
      "Human Resources",

    designation:
      "HR Manager",

    monthlySalary:
      60000,

    leaveBalance:
      18
  });

  console.log(
    "HR account created."
  );

} else {

  console.log(
    "HR account already exists."
  );

}


await mongoose.disconnect();