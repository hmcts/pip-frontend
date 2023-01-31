import fileErrorHandlerMiddleware from '../../../main/middlewares/fileErrorHandler.middleware';
import { NextFunction, Response } from 'express';

const nextFunction: NextFunction = jest.fn();
let mockRequest: Partial<Request>;
let mockResponse: Partial<Response>;
const fileRequest = {};
const errorRequest = {};
const expectedFileLimitRequest = {
    file: { size: 2000001, originalname: 'too_large_file.pdf' },
};
const expectedErrorRequest = { query: { showerror: 'true' } };

describe('File Error Handler Middleware', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('it should pass through if there are no errors', () => {
        fileErrorHandlerMiddleware(null, mockRequest, mockResponse as unknown as Response, nextFunction);
        expect(nextFunction).toBeCalledTimes(1);
    });

    it('should set dummy request properties if there is file size error', () => {
        fileErrorHandlerMiddleware(
            { code: 'LIMIT_FILE_SIZE' },
            fileRequest,
            mockResponse as unknown as Response,
            nextFunction
        );
        expect(fileRequest).toStrictEqual(expectedFileLimitRequest);
        expect(nextFunction).toBeCalledTimes(1);
    });

    it('should set error query param if any other error occurs', () => {
        fileErrorHandlerMiddleware({ code: 'FOO' }, errorRequest, mockResponse as unknown as Response, nextFunction);
        expect(errorRequest).toStrictEqual(expectedErrorRequest);
        expect(nextFunction).toBeCalledTimes(1);
    });
});
