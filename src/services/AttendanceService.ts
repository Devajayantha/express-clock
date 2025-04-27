import { Attendance } from "@prisma/client";
import { config } from "../configs/config";
import { Request, Response } from "express";

class AttendanceService {
  static async getAllAttendances(req: Request, res: Response): Promise<Attendance[]> {
    const prisma = config.prisma.getClient();

    const attendances = await prisma.attendance.findMany({
      include: {
        user: true,
      },
    });

    return attendances;
  }
}

export default AttendanceService;