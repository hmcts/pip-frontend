import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';

/**
 * Controller for handling CRIME Rejected logins
 */
export default class CrimeRejectedLoginController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        res.render('crime-rejected-login', req.i18n.getDataByLanguage(req.lng)['crime-rejected-login']);
    }
}
