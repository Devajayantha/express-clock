import { Request, Response } from "express";
import { returnResponse } from "../utils/response.utils";
import { StatusCode } from "../enums/status-code.enum";
import { AuthRequest } from "../interfaces/auth.interface";
import { save as saveOnElastic, searchWithUpdate as updateOnElastic, showAll } from "../actions/elastics.action";
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

    await saveOnElastic(req, res,
      {
        attendanceId: attendance.id,
        userId: user.id,
        clockIn: attendance.clockIn,
        clockOut: null
      }, "attendances");

    returnResponse(res, StatusCode.OK, true, { attendance }, "User clocked in successfully");
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

    if (existAttendance[0].clock_out) {
      returnResponse(res, StatusCode.BAD_REQUEST, false, [], "You have already clocked out today");
      return;
    }

    const attendance = await prisma.attendance.update({
      where: {
        id: existAttendance[0].id
      },
      data: {
        clockOut: new Date()
      }
    });

    await updateOnElastic(req, res, "attendances", {
      doc: {
        clockOut: attendance.clockOut
      }
    }, attendance.id);

    returnResponse(res, StatusCode.OK, true, { attendance }, "User clocked out successfully");
  } catch (error) {
    returnResponse(res, StatusCode.SERVER_ERROR, false, [], "Internal server error");
  }
}

export async function getAttendance(req: Request, res: Response) {
  try {
    const authReq = req as AuthRequest;
    const user = authReq.user;
    
    const startDate = req.query.startDate
      ? req.query.startDate
      : null;

    const endDate = req.query.endDate
      ? req.query.endDate
      : null;

    let filters: any[] = [{ term: { userId: user.id } }];

    if (startDate && endDate) {
      filters.push({
        range: {
          clockIn: {
            gte: startDate,
            lte: endDate
          }
        }
      })
    }
    
    const data = await showAll(req, res, "attendances", filters);

    returnResponse(res, StatusCode.OK, true, data, "Attendances fetched successfully");
  } catch (error) {
    returnResponse(res, StatusCode.SERVER_ERROR, false, [], "Internal server error");
  }
}