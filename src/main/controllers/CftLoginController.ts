import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { CFT_IDAM_URL, FRONTEND_URL } from '../helpers/envUrls';

export default class CftLoginController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const isIdamWebPublic = CFT_IDAM_URL.includes('idam-web-public');
        const params = new URLSearchParams({
            client_id: 'app-pip-frontend',
            response_type: 'code',
            redirect_uri: FRONTEND_URL + '/cft-login/return',
            ui_locales: req.lng,
        });

        // for AAT IDAM redirect issue on builds, will be removed once PUB-3285 is merged
        if (isIdamWebPublic) {
            params.set('scope', 'openid profile roles');
            res.redirect(CFT_IDAM_URL + '/o/authorize?' + params.toString());
        } else {
            res.redirect(CFT_IDAM_URL + '?' + params.toString());
        }
    }
}
