import { body } from "express-validator";

export const loginRequest = [
  body("email")
    .notEmpty().withMessage("Email is required")
    .bail()
    .isEmail().withMessage("Invalid email format"),
  body("password")
    .notEmpty().withMessage("Password is required")
    .bail()
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
];