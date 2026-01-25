import { Request, Response, NextFunction, RequestHandler } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

export function validationMiddleware(
  type: any,
  skipMissingProperties = false,
): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const dtoObj = plainToInstance(type, req.body);

    validate(dtoObj, {
      skipMissingProperties,
      whitelist: true,
      forbidNonWhitelisted: true,
    }).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const dtoErrors = errors
          .map((error: ValidationError) =>
            (Object as any).values(error.constraints),
          )
          .join(', ');

        res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: dtoErrors,
        });
      } else {
        /*       req.body = dtoObj; */
        next();
      }
    });
  };
}
