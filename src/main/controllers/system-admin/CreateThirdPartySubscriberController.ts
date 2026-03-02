import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { ThirdPartyService } from '../../service/ThirdPartyService';

const thirdPartyService = new ThirdPartyService();

export default class CreateThirdPartySubscriberController {
    public get(req: PipRequest, res: Response): void {
        const formData = req.cookies?.formCookie ? JSON.parse(req.cookies['formCookie']) : {};

        res.render('system-admin/create-third-party-subscriber', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['create-third-party-subscriber']),
            formData,
        });
    }

    public post(req: PipRequest, res: Response): void {
        const formData = req.body;
        const formErrors = thirdPartyService.validateThirdPartySubscriberFormFields(formData);

        if (formErrors) {
            res.render('system-admin/create-third-party-subscriber', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['create-third-party-subscriber']),
                formData,
                formErrors,
            });
        } else {
            res.cookie('formCookie', JSON.stringify(formData), { secure: true });
            res.redirect('/create-third-party-subscriber-summary');
        }
    }
}
