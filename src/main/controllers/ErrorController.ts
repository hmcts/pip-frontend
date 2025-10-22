import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';

/**
 * Controller for handling error page
 */
export default class ErrorController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        res.render('error', req.i18n.getDataByLanguage(req.lng)['error']);
    }
}
