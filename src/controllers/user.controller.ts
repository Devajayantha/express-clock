import { NextFunction, Request, Response } from 'express';
import { returnResponse } from '../utils/response.utils';
import { StatusCode } from '../enums/status-code.enum';

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    returnResponse(res, StatusCode.OK, true, [], "User logged in successfully");
  } catch (error) {
    next(error);
  }
}