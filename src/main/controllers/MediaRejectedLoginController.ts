import { Response } from 'express';
import { PipRequest } from '../models/request/PipRequest';
import { cloneDeep } from 'lodash';

export default class MediaRejectedLoginController {
    public get(req: PipRequest, res: Response): void {
        res.render('media-rejected-login', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['media-rejected-login']),
            frontendUrl: process.env.FRONTEND_URL,
        });
    }
}
