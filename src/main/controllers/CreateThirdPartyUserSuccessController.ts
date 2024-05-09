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

        this.removeThirdPartyUserFromFormCookie(res, formData);
    }

    private removeThirdPartyUserFromFormCookie(res, formData) {
        formData.thirdPartyName = '';
        formData.thirdPartyRole = '';
        formData.thirdPartyRoleObject = null;
        res.cookie('formCookie', JSON.stringify(formData), { secure: true });
    }
}
