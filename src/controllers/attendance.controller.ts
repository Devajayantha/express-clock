import { Request, Response } from "express";
import { returnResponse } from "../utils/response.utils";
import { StatusCode } from "../enums/status-code.enum";
import { AuthRequest } from "../interfaces/auth.interface";
import prisma from "../configs/prisma.config";

export async function clockIn(req: Request, res: Response) {
  try {
    const authReq = req as AuthRequest;
    const user = authReq.user;

    const existAttendance = await prisma.$queryRawUnsafe<any[]>(`
      SELECT * FROM attendances
      WHERE userId = '${user.id}'
      AND DATE(created_at) = CURDATE()
      LIMIT 1
    `);

    if (existAttendance.length > 0) {
      returnResponse(res, StatusCode.BAD_REQUEST, false, [], "You have already clocked in today");
      return;
    }

    const attendance = await prisma.attendance.create({
      data: {
        userId: user.id,
        clockIn: new Date()
      }
    });

    returnResponse(res, StatusCode.OK, true, { user }, "User clocked in successfully");
  } catch (error) {
    returnResponse(res, StatusCode.SERVER_ERROR, false, [], "Internal server error");
  }
}

export async function clockOut(req: Request, res: Response) {
  try {
    const authReq = req as AuthRequest;
    const user = authReq.user;

    const existAttendance = await prisma.$queryRawUnsafe<any[]>(`
      SELECT * FROM attendances
      WHERE userId = '${user.id}'
      AND DATE(created_at) = CURDATE()
      LIMIT 1
    `);

    if (existAttendance.length === 0) {
      returnResponse(res, StatusCode.BAD_REQUEST, false, [], "You have not clocked in today");
      return;
    }

    // todo check if user has already clocked out

    const attendance = await prisma.attendance.update({
      where: {
        id: existAttendance[0].id
      },
      data: {
        clockOut: new Date()
      }
    });

    returnResponse(res, StatusCode.OK, true, { user }, "User clocked out successfully");
  } catch (error) {
    returnResponse(res, StatusCode.SERVER_ERROR, false, [], "Internal server error");
  }
}