import { config } from "../configs/config";
import { Response } from "express";
import AuthRequest from "../interfaces/AuthRequest";
import UserRequest from "../interfaces/UserRequest";
import Helper from "../utils/Helper";
import { ApiResponse } from "@elastic/elasticsearch";

interface Attendance {
  id: string;
  user_name: string;
  clock_in: Date;
  clock_out: Date | null;
}

class AttendanceService {
  static async getAttendance(req: AuthRequest, res: Response): Promise<Attendance[]> {
    const user = req.user as UserRequest;
    const { start_date, end_date } = req.query;

    const filterStartDate = start_date ? new Date(start_date as string) : Helper.getFirstDateOfMonth();
    const filterEndDate = end_date ? new Date(end_date as string) : Helper.getLastDateOfMonth();

    const { body }: ApiResponse = await config.elastic.search("attendance", {
      query: {
        bool: {
          must: [
          {
            match: {
              user_id: user.id,
            },
          },
          {
            range: {
              created_at: {
                gte: filterStartDate.toISOString(),
                lte: filterEndDate.toISOString(),
                format: "strict_date_time", 
              },
            },
          },
          ]
        }
      }
    });

    const attendances: Attendance[] = body.hits.hits.map((hit: any) => {
      return {
        id: hit._source.id,
        user_name: user.name,
        clock_in: hit._source.clock_in,
        clock_out: hit._source.clock_out
      }
    });

    return attendances;
  }

  static async clockIn(req: AuthRequest, res: Response): Promise<void> {
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

    const datePart = Helper.formatDateForId(attendance.clockIn);

    await config.elastic.addRecord("attendance", {
      id: attendance.id,
      user_id: user.id,
      clock_in: attendance.clockIn,
      created_at: attendance.createdAt,
    }, `${user.id}_${attendance.id}`);

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

    const attendance = await prisma.attendance.update({
      where: {
        id: redisAttendance.id,
      },
      data: {
        clockOut: new Date(),
      },
    });

    await config.redis.set(redisKey, JSON.stringify({
      id: attendance.id,
      clock_in: attendance.clockIn,
      clock_out: attendance.clockOut
    }), Helper.getSecondsUntilMidnight());

    const datePart = Helper.formatDateForId(attendance.clockIn);

    await config.elastic.updateRecord("attendance", `${attendance.id}_${datePart}`, {
      clock_out: attendance.clockOut
    });

    res.status(200).json({
      success: true,
      message: "Clock-out time recorded successfully",
      data: {}
    });
  }
}

export default AttendanceService;