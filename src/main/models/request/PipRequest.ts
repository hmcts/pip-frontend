import { Request } from 'express';
import {I18NextRequest} from "i18next-http-middleware";

export interface PipRequest extends I18NextRequest, Request {
    lng?: string;
    user?: object;
    file?: File;
}
