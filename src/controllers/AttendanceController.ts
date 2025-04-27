import { Request, Response } from "express";
import AttendanceService from "../services/AttendanceService";

class AttendanceController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const attendances = await AttendanceService.getAllAttendances(req, res);

      res.status(200).json({
        success: true,
        message: "Attendance records retrieved successfully",
        data: attendances,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Error retrieving attendance records",
        error: error.message,
      });
    }
  }
}

export default AttendanceController;