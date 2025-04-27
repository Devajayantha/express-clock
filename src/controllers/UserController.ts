
import { Request, Response } from 'express';
import { StatusCode } from '../enums/StatusCode';
import UserSerrvice from '../services/UserService';

class UserController {
  static async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    try {
      await UserSerrvice.login({email, password}, res);
      
    } catch (error) {
      res.status(StatusCode.SERVER_ERROR).json({
        success: false,
        message: 'Internal server error',
        data: [],
        errors: { error: error }
      });
    }
  }
}

export default UserController;