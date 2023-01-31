import { NextFunction, Response } from 'express';

const fileErrorHandlerMiddleware = (error, request, response: Response, next: NextFunction): any => {
    if (error) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            // set dummy properties to trigger proper error message
            request.file = {
                size: 2000001,
                originalname: 'too_large_file.pdf',
            };
            next();
        } else {
            request.query = { showerror: 'true' };
            next();
        }
    } else {
        next();
    }
};

export default fileErrorHandlerMiddleware;
