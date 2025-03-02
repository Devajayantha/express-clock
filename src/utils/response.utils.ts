import { Response } from 'express';
import { StatusCode } from '../enums/status-code.enum';

export function returnResponse(
    res: Response, 
    statusCode: StatusCode, 
    success: boolean, 
    data: any = [], 
    message: string,
    errors: Record<string, any> = {}
  ): Response {
    return res.status(statusCode).json({
      success,
      data,
      message,
      errors
    });
}