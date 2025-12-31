import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { ThirdPartyService } from '../../service/ThirdPartyService';

const thirdPartyService = new ThirdPartyService();

export default class ManageThirdPartySubscriberOathConfigController {
    public get(req: PipRequest, res: Response): void {
        const formData = req.cookies?.formCookie ? JSON.parse(req.cookies['formCookie']) : {};

        res.render('system-admin/manage-third-party-subscriber-oath-config', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['manage-third-party-subscriber-oath-config']),
            formData,
        });
    }

    public post(req: PipRequest, res: Response): void {
        const formData = req.body;
        const formErrors = thirdPartyService.validateThirdPartySubscriberOathConfigFormFields(formData);

        if (formErrors) {
            res.render('system-admin/manage-third-party-subscriber-oath-config', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['manage-third-party-subscriber-oath-config']),
                formData,
                formErrors,
            });
        } else {
            res.cookie('formCookie', JSON.stringify(formData), { secure: true });
            res.redirect('/manage-third-party-subscriber-oath-config-summary');
        }
    }
}
