import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { CFT_IDAM_URL, FRONTEND_URL } from '../helpers/envUrls';

export default class CftLoginController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const params = new URLSearchParams({
            client_id: 'app-pip-frontend',
            response_type: 'code',
            redirect_uri: FRONTEND_URL + '/cft-login/return',
            ui_locales: req.lng,
        });

        res.redirect(CFT_IDAM_URL + '?' + params.toString());
    }
}
