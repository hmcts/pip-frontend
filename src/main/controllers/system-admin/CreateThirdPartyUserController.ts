import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { CourtelThirdPartyService } from '../../service/CourtelThirdPartyService';

const courtelThirdPartyService = new CourtelThirdPartyService();

export default class CreateThirdPartyUserController {
    public get(req: PipRequest, res: Response): void {
        const formData = req.cookies?.formCookie ? JSON.parse(req.cookies['formCookie']) : {};

        res.render('system-admin/create-third-party-user', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['create-third-party-user']),
            userRoleList: courtelThirdPartyService.buildThirdPartyRoleList(formData.thirdPartyRole),
            formData,
        });
    }

    public post(req: PipRequest, res: Response): void {
        const formData = req.body;
        const formErrors = courtelThirdPartyService.validateThirdPartyUserFormFields(formData);

        if (formErrors) {
            res.render('system-admin/create-third-party-user', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['create-third-party-user']),
                userRoleList: courtelThirdPartyService.buildThirdPartyRoleList(formData.thirdPartyRole),
                formData,
                formErrors,
            });
        } else {
            formData.thirdPartyRoleObject = courtelThirdPartyService.getThirdPartyRoleByKey(formData.thirdPartyRole);
            res.cookie('formCookie', JSON.stringify(formData), { secure: true });
            res.redirect('/create-third-party-user-summary');
        }
    }
}
