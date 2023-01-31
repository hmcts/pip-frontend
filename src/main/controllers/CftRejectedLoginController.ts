import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';

/**
 * Controller for handling CFT Rejected logins
 */
export default class CftRejectedLoginController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        res.render('cft-rejected-login', req.i18n.getDataByLanguage(req.lng)['cft-rejected-login']);
    }
}
