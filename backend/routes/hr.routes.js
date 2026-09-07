import { Router } from "express";

import { dashboard,employees,updateEmployeeStatus} from "../controllers/hr.controller.js";

import {protect, requireRole} from "../middleware/auth.js";

const router = Router();

router.use( protect, requireRole("hr"));


router.get("/dashboard",dashboard);

router.get("/employees",employees);

router.patch("/employees/:id/status",updateEmployeeStatus);

export default router;