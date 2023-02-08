// import { winston } from "../config/winston.config";
import { Request, Response, NextFunction } from 'express'
import { statusCode } from '../types/statusCode.types';

export const globalError = (err, req: Request, res: Response, next: NextFunction) => {
    // winston.error(err);
    return errorResponse(res);
}

export const successResponse = (res: Response, data: object) => (
    res.status(statusCode.SuccessOK).send(data)
);
export const responseMessage = (res: Response, statusCode: number,data?: object) => (
    res.status(statusCode).send(data)   
);

export const errorResponse = (res: Response) => (
    res.status(statusCode.ServerErrorInternal).send()
);

export const validationErrorResponse = (res: Response, data:object) => (
    res.status(statusCode.ClientErrorBadRequest).send(data)
);

export const NotFoundErrorResponse = (res: Response) => (
    res.status(statusCode.ServerNotFound).send()
);

export const unauthorizedResponse = (res: Response, data?:object) => (
    res.status(statusCode.unauthorized).send(data)
);

export const forbiddenResponse = (res: Response) => (
    res.status(statusCode.forbidden).send()
);