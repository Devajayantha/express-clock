import { NextFunction, Request, response, Response } from "express";
import { StatusCode } from "../enums/StatusCode";
import jwt from 'jsonwebtoken';
import { config } from '../configs/config';
import AuthRequest from "../interfaces/AuthRequest";
import UserRequest from "../interfaces/UserRequest";

export default class AuthMiddleware {
  static async authenticate(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const prisma = config.prisma.getClient();
      const redis = config.redis.getClient();

      const authHeader = req.header('Authorization');

      if (!authHeader) {
        res.status(StatusCode.UNAUTHORIZED).json({
          success: false,
          message: 'No token provided',
          data: [],
          errors: {},
        });

        return;
      }

      const token = authHeader.replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

      if (typeof decoded === 'string') {
        res.status(StatusCode.UNAUTHORIZED).json({
          success: false,
          message: 'Invalid token',
          data: [],
          errors: {},
        });

        return;
      }

      const storedToken = await prisma.personalAccessToken.findUnique({
        where: { token },
      });

      if (!storedToken) {
        res.status(StatusCode.UNAUTHORIZED).json({
          success: false,
          message: 'Token not found',
          data: [],
          errors: {},
        });

        return;
      }

      if (new Date() > storedToken.expiredAt) {
        await prisma.personalAccessToken.delete({ where: { token } });

        res.status(StatusCode.UNAUTHORIZED).json({
          success: false,
          message: 'Token expired',
          data: [],
          errors: {},
        });

        return;
      }

      let user: UserRequest | undefined;

      const cacheUser = await redis.get(`user:${(decoded as jwt.JwtPayload).id}`);

      if (cacheUser) {
        user = JSON.parse(cacheUser) as UserRequest;
      } else {
        const user = await prisma.user.findFirst({
          where: { id: (decoded as jwt.JwtPayload).id },
          select: {
            id: true,
            name: true,
            email: true,
          },
        });

        if (!user) {
          res.status(StatusCode.UNAUTHORIZED).json({
            success: false,
            message: 'User not found',
            data: [],
            errors: {},
          });

          return;
        }

        await redis.set(`user:${(decoded as jwt.JwtPayload).id}`, JSON.stringify(user));
      }

      req.user = user;
      next();
    } catch (error: any) {
      res.status(StatusCode.UNAUTHORIZED).json({
        success: false,
        message: 'Unauthorized',
        data: [],
        errors: error?.message || 'Internal server error',
      });

      return;
    }
  }
}