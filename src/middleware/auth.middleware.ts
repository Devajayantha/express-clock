import { NextFunction, Request, Response } from "express";
import { User } from '@prisma/client';
import { returnResponse } from "../utils/response.utils";
import { StatusCode } from "../enums/status-code.enum";
import jwt from 'jsonwebtoken';
import prisma from "../configs/prisma.config";

export async function authenticate(req: Request & { user?: User }, res: Response, next: NextFunction) {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      returnResponse(res, StatusCode.UNAUTHORIZED, false, [], "Authorization header missing");
      return;
    }
    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    if (typeof decoded === 'string') {
      returnResponse(res, StatusCode.UNAUTHORIZED, false, [], "Invalid token");
      return;
    }

    const storedToken = await prisma.personalAccessToken.findUnique({ where: { token } });

    if (!storedToken) {
      returnResponse(res, StatusCode.UNAUTHORIZED, false, [], "Invalid token");
      return;
    }

    if (new Date() > storedToken.expiredAt) {
      await prisma.personalAccessToken.delete({ where: { token } });

      returnResponse(res, StatusCode.UNAUTHORIZED, false, [], "Token expired");
      return;
    }

    const user = await prisma.user.findFirst({
      where: { id: (decoded as jwt.JwtPayload).id }
    });

    if (!user) {
      returnResponse(res, StatusCode.NOT_FOUND, false, [], "User not found", { email: "User not found" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    returnResponse(res, StatusCode.UNAUTHORIZED, false, [], "Please authenticate");
  }
}