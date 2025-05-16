import { query } from "express-validator";

export default class AttendanceRequest {
  static list() {
    return [
      query("start_date")
        .optional()
        .isDate()
        .withMessage("Start date must be a valid date"),
      query("end_date")
        .optional()
        .isDate()
        .withMessage("End date must be a valid date"),
    ]
  }
}