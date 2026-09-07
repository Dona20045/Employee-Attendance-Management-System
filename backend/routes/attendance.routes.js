import { Router } from "express";

import {checkIn,checkOut,myAttendance,today,allAttendance} from "../controllers/attendance.controller.js";

import {protect,requireRole} from "../middleware/auth.js";

const router = Router();

router.use(protect);


// Employee
router.post("/check-in",checkIn);

router.patch("/check-out",checkOut);

router.get("/my",myAttendance);

router.get("/today", today);


// HR
router.get("/all",requireRole("hr"), allAttendance);

export default router;