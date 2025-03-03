import { NextFunction, Request, Response } from "express";
import { returnResponse } from "../utils/response.utils";
import { StatusCode } from "../enums/status-code.enum";
import jwt from 'jsonwebtoken';
import prisma from "../configs/prisma.config";
import { getDetail as getFromRedis, save as saveIntoRedis } from "../actions/redis.action";

interface AuthUser {
  id: number;
  email: string;
  name: string;
}

export async function authenticate(req: Request & { user?: AuthUser }, res: Response, next: NextFunction) {
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

    const getUserOnRedis = await getFromRedis('users', (decoded as jwt.JwtPayload).id);

    if (getUserOnRedis) {
      const userMap: AuthUser = {
        id: Number(getUserOnRedis.id),
        name: getUserOnRedis.name,
        email: getUserOnRedis.email
      }

      req.user = userMap
      next();
      return;
    }

    const user = await prisma.user.findFirst({
      where: { id: (decoded as jwt.JwtPayload).id }
    });

    if (!user) {
      returnResponse(res, StatusCode.NOT_FOUND, false, [], "User not found", { email: "User not found" });
      return;
    }

    await saveIntoRedis('users', user.id, {
      id: user.id,
      name: user.name,
      email: user.email
    });

    req.user = user;
    next();
  } catch (error) {
    returnResponse(res, StatusCode.UNAUTHORIZED, false, [], "Please authenticate");
  }
}