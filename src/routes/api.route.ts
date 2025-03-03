import express from 'express';
import * as AttendanceController from '../controllers/attendance.controller'; 
import * as UserController from '../controllers/user.controller';
import { validate } from '../utils/validation.utils';
import { loginRequest } from '../requests/login.request';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

router.post("/auth/login", validate(loginRequest), UserController.login);

router.post("/attendances/clock-in", authenticate, AttendanceController.clockIn)
router.patch("/attendances/clock-out", authenticate, AttendanceController.clockOut)

router.get("/attendances", authenticate, AttendanceController.getAttendance)

export default router;