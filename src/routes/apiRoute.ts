import express from 'express';
import AttendanceController from '../controllers/AttendanceController'; 
import UserController from '../controllers/UserController';

import AuthValidator from '../requests/LoginRequest';
import AuthMiddleware from '../middleware/AuthMiddleware';
import RequestValidator from '../utils/RequestValidator';

const router = express.Router();

router.post("/auth/login", RequestValidator.validate(AuthValidator.login()), UserController.login);


router.get("/attendances", AuthMiddleware.authenticate, AttendanceController.getAll)

export default router;