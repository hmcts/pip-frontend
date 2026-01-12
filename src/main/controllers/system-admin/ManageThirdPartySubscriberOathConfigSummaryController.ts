import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { ThirdPartyService } from '../../service/ThirdPartyService';
import { UserManagementService } from '../../service/UserManagementService';

const thirdPartyService = new ThirdPartyService();
const userManagementService = new UserManagementService();

export default class ManageThirdPartySubscriberOathConfigSummaryController {
    public get(req: PipRequest, res: Response): void {
        const formData = req.cookies?.formCookie ? JSON.parse(req.cookies['formCookie']) : {};
        res.render('system-admin/manage-third-party-subscriber-oath-config-summary', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['manage-third-party-subscriber-oath-config-summary']),
            formData,
            displayError: false,
        });
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        const formData = req.cookies?.formCookie ? JSON.parse(req.cookies['formCookie']) : {};
        let response: boolean;
        if (formData.createConfig) {
            response = await thirdPartyService.createThirdPartySubscriberOathConfig(formData, req.user['userId']);
        } else {
            response = await thirdPartyService.updateThirdPartySubscriberOathConfig(formData, req.user['userId']);
        }

        if (response) {
            await userManagementService.auditAction(
                req.user,
                'THIRD_PARTY_SUBSCRIBER_CREATION',
                `Third party oath config created successfully`
            );
            res.redirect('/manage-third-party-subscriber-oath-config-success');
        } else {
            res.render('system-admin/manage-third-party-subscriber-oath-config-summary', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['manage-third-party-subscriber-oath-config-summary']),
                formData,
                displayError: true,
            });
        }
    }
}
