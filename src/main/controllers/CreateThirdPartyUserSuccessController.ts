import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';

export default class CreateThirdPartyUserSuccessController {
    public get(req: PipRequest, res: Response): void {
        const formData = req.cookies?.formCookie ? JSON.parse(req.cookies['formCookie']) : {};
        res.render('create-third-party-user-success', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['create-third-party-user-success']),
            formData,
        });

        res.clearCookie('formCookie');
    }
}
