import { Request, Response } from "express";
import AttendanceService from "../services/AttendanceService";
import AuthRequest from '../interfaces/AuthRequest';

class AttendanceController {
  static async getAttendance(req: AuthRequest, res: Response): Promise<void> {
    try {
      const attendances = await AttendanceService.getAttendance(req, res);
      
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

  static async storeClockIn(req: Request, res: Response): Promise<void> {
    try {
      await AttendanceService.clockIn(req, res);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Error recording clock-in time",
        error: error.message,
      });
    }
  }

  static async storeClockOut(req: AuthRequest, res: Response): Promise<void> {
    try {
      await AttendanceService.clockOut(req, res);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Error recording clock-out time",
        error: error.message,
      });
    }
  }
}

export default AttendanceController;