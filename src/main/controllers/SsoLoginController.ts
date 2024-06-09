import {PipRequest} from "../models/request/PipRequest";
import {Response} from "express";
import {FRONTEND_URL, MICROSOFT_LOGIN_URL} from "../helpers/envUrls";

export default class SsoLoginController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const params = new URLSearchParams({
            client_id: process.env.SSO_CLIENT_ID,
            response_type: 'code',
            redirect_uri: FRONTEND_URL + '/sso',
            scope: 'openid profile',
        });

        res.redirect(`${MICROSOFT_LOGIN_URL}/${process.env.SSO_TENANT_ID}/oauth2/v2.0/authorize?` + params.toString());
    }
}
