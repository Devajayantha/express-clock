import { NextFunction, Request, Response } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { returnResponse } from './response.utils';
import { StatusCode } from '../enums/status-code.enum';

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      returnResponse(res, StatusCode.BAD_REQUEST, false, [], "Validation error", errors.array());
    }

    next();
  };
};