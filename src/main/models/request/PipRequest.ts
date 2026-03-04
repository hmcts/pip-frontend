import { Request } from 'express';

export interface PipRequest extends Request {
    lng?: string;
    user?: object;
    file?: File;
}
