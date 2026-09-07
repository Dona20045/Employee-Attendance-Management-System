import { Router } from "express";

import {
  createLeave,
  myLeaves,
  allLeaves,
  updateLeaveStatus
} from "../controllers/leave.controller.js";

import {
  protect,
  requireRole
} from "../middleware/auth.js";

const router = Router();

router.use(protect);


// Employee
router.post( "/",createLeave);

router.get("/my",myLeaves);


// HR
router.get("/all",requireRole("hr"),allLeaves);

router.patch("/:id/status", requireRole("hr"),updateLeaveStatus);

export default router;