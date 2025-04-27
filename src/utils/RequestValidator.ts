import { NextFunction, Request, RequestHandler, Response } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { StatusCode } from '../enums/StatusCode';

export default class RequestValidator {
  static validate(validations: ValidationChain[]): RequestHandler {
    return (req: Request, res: Response, next: NextFunction): void => {
      Promise.all(validations.map((validation) => validation.run(req)))
        .then(() => {
          const errors = validationResult(req);

          if (!errors.isEmpty()) {
            res.status(StatusCode.BAD_REQUEST).json({
              success: false,
              message: 'Validation failed',
              data: [],
              errors: errors.array(),
            });
          } else {
            next();
          }
        })
        .catch((err) => {
          next(err); // biar Express bisa handle error-nya
        });
    };
  }
}