import { Request, Response, NextFunction } from "express";

const asyncHandler = (requestHandler: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await requestHandler(req, res, next);
        } catch (error: any) {
            console.error("Error while handling request:", error);
            // Call next with the error to pass it to the default error handler
            next(error);
        }
    };
};

export { asyncHandler };
