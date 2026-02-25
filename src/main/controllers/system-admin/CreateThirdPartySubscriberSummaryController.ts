import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { ThirdPartyService } from '../../service/ThirdPartyService';
import { UserManagementService } from '../../service/UserManagementService';

const thirdPartyService = new ThirdPartyService();
const userManagementService = new UserManagementService();

export default class CreateThirdPartySubscriberSummaryController {
    public get(req: PipRequest, res: Response): void {
        const formData = req.cookies?.formCookie ? JSON.parse(req.cookies['formCookie']) : {};
        res.render('system-admin/create-third-party-subscriber-summary', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['create-third-party-subscriber-summary']),
            formData,
            displayError: false,
        });
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        const formData = req.cookies?.formCookie ? JSON.parse(req.cookies['formCookie']) : {};
        const response = await thirdPartyService.createThirdPartySubscriber(formData, req.user['userId']);

        if (response) {
            await userManagementService.auditAction(
                req.user,
                'THIRD_PARTY_SUBSCRIBER_CREATION',
                `Third-party subscriber created for: ${formData.thirdPartySubscriberName}`
            );
            res.redirect('/create-third-party-subscriber-success');
        } else {
            res.render('system-admin/create-third-party-subscriber-summary', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['create-third-party-subscriber-summary']),
                formData,
                displayError: true,
            });
        }
    }
}
