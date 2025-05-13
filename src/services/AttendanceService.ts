import { Attendance } from "@prisma/client";
import { config } from "../configs/config";
import { Response } from "express";
import AuthRequest from "../interfaces/AuthRequest";
import UserRequest from "../interfaces/UserRequest";
import Helper from "../utils/Helper";

class AttendanceService {
  static async clockIn(req: AuthRequest, res: Response): Promise<void> {
    const leftTotal = Helper.getSecondsUntilMidnight();

    console.info("########### ", leftTotal);

    const user = req.user as UserRequest;
    const prisma = config.prisma.getClient();
    const redisKey = `attendance:${user.id}`;

    const redisAttendance = await config.redis.get(redisKey);

    if (redisAttendance) {
      res.status(200).json({
        success: true,
        message: "Already clocked in",
        data: redisAttendance
      })

      return;
    }

    const attendance = await prisma.attendance.create({
      data: {
        userId: user.id,
        clockIn: new Date(),
      },
    });

    await config.redis.set(redisKey, JSON.stringify({
      id: attendance.id,
      clock_in: attendance.clockIn,
      clock_out: attendance.clockOut
    }), Helper.getSecondsUntilMidnight());

    res.status(201).json({
      success: true,
      message: "Clock-in time recorded successfully",
      data: {
        id: attendance.id,
        clock_in: attendance.clockIn,
        clock_out: attendance.clockOut
      }
    });
  }

  static async clockOut(req: AuthRequest, res: Response): Promise<void> {
    const user = req.user as UserRequest;
    const prisma = config.prisma.getClient();
    const redisKey = `attendance:${user.id}`;

    const redisAttendance = await config.redis.get(redisKey);

    if (!redisAttendance) {
      res.status(200).json({
        success: true,
        message: "Please clock in first",
      })

      return;
    }

    if (redisAttendance.clock_out) {
      res.status(200).json({
        success: true,
        message: "Already clocked out",
        data: redisAttendance
      })

      return;
    }

    console.log("Attendance clock out", redisAttendance);

    const attendance = await prisma.attendance.update({
      where: {
        id: redisAttendance.id,
      },
      data: {
        clockOut: new Date(),
      },
    });

    console.log("Attendance clock out", attendance);

    await config.redis.set(redisKey, JSON.stringify({
      id: attendance.id,
      clock_in: attendance.clockIn,
      clock_out: attendance.clockOut
    }), Helper.getSecondsUntilMidnight());

    res.status(200).json({
      success: true,
      message: "Clock-out time recorded successfully",
      data: {}
    });
  }
}

export default AttendanceService;