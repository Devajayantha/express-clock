
import { body } from 'express-validator';

export default class AuthValidator {
  static login() {
    return [
      body('email')
        .notEmpty().withMessage('Email is required')
        .bail()
        .isEmail().withMessage('Invalid email format'),
      body('password')
        .notEmpty().withMessage('Password is required')
        .bail()
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    ];
  }
}
