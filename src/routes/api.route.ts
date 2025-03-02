import express from 'express';
import * as UserController from '../controllers/user.controller';
import { validate } from '../utils/validation.utils';
import { loginRequest } from '../requests/login.request';

const router = express.Router();

router.post("/auth/login", validate(loginRequest), UserController.login);

export default router;