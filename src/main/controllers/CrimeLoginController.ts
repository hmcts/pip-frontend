import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { CRIME_IDAM_URL, FRONTEND_URL } from '../helpers/envUrls';
import process from 'process';
import config from 'config';

let crimeIdamClientId;

if (process.env.CRIME_IDAM_CLIENT_ID) {
    crimeIdamClientId = process.env.CRIME_IDAM_CLIENT_ID;
} else {
    crimeIdamClientId = config.get('secrets.pip-ss-kv.CRIME_IDAM_CLIENT_ID');
}

const params = new URLSearchParams({
    response_type: 'code',
    client_id: crimeIdamClientId,
    redirect_uri: FRONTEND_URL + '/crime-login/return',
    scope: 'openid profile email',
});

export default class CrimeLoginController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        res.redirect(CRIME_IDAM_URL + '/idp/oauth2/authorize?' + params.toString());
    }
}
