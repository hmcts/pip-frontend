import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { CRIME_IDAM_URL, FRONTEND_URL } from '../helpers/envUrls';

export default class CrimeLoginController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const params = new URLSearchParams({
            response_type: 'code',
            client_id: process.env.CRIME_IDAM_CLIENT_ID,
            redirect_uri: FRONTEND_URL + '/crime-login/return',
            scope: 'openid profile email',
        });
        res.redirect(CRIME_IDAM_URL + '/idp/oauth2/authorize?' + params.toString());
    }
}
