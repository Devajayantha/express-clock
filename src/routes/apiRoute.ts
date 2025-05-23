import express from 'express';
import AttendanceController from '../controllers/AttendanceController'; 
import UserController from '../controllers/UserController';

import AuthValidator from '../requests/LoginRequest';
import AuthMiddleware from '../middleware/AuthMiddleware';
import RequestValidator from '../utils/RequestValidator';
import AttendanceRequest from '../requests/AttendanceRequest';

const router = express.Router();

router.post("/auth/login", RequestValidator.validate(AuthValidator.login()), UserController.login);

router.get("/attendances", AuthMiddleware.authenticate, RequestValidator.validate(AttendanceRequest.list()), AttendanceController.getAttendance);
router.post("/attendances/clock-in", AuthMiddleware.authenticate, AttendanceController.storeClockIn);
router.patch("/attendances/clock-out", AuthMiddleware.authenticate, AttendanceController.storeClockOut);

export default router;