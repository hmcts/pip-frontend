import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';

export default class CreateThirdPartySubscriberSuccessController {
    public get(req: PipRequest, res: Response): void {
        const formData = req.cookies?.formCookie ? JSON.parse(req.cookies['formCookie']) : {};
        res.render('system-admin/create-third-party-subscriber-success', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['create-third-party-subscriber-success']),
            formData,
        });

        res.clearCookie('formCookie');
    }
}
