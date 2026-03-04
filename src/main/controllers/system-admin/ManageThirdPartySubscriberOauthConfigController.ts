import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { ThirdPartyService } from '../../service/ThirdPartyService';
import { KeyVaultService } from '../../service/KeyVaultService';

const thirdPartyService = new ThirdPartyService();
const keyVaultService = new KeyVaultService();

export default class ManageThirdPartySubscriberOauthConfigController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        let formData = req.cookies?.thirdPartySubscriberCookie
            ? JSON.parse(req.cookies['thirdPartySubscriberCookie'])
            : {};

        const userId = req.query.userId as string;
        if (formData.user != userId) {
            formData = await thirdPartyService.getThirdPartySubscriberOauthConfigByUserId(userId, req.user['userId']);

            if (!formData || typeof formData !== 'object') {
                formData = {};
                formData.createConfig = 'true';
            } else {
                formData.scope = await keyVaultService.getSecret(formData.scopeKey);
                formData.clientId = await keyVaultService.getSecret(formData.clientIdKey);
                formData.clientSecret = await keyVaultService.getSecret(formData.clientSecretKey);
            }

            formData.user = userId;
        }

        res.render('system-admin/manage-third-party-subscriber-oauth-config', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['manage-third-party-subscriber-oauth-config']),
            formData,
        });
    }

    public post(req: PipRequest, res: Response): void {
        const formData = req.body;
        const formErrors = thirdPartyService.validateThirdPartySubscriberOauthConfigFormFields(formData);

        if (formErrors) {
            res.render('system-admin/manage-third-party-subscriber-oauth-config', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['manage-third-party-subscriber-oauth-config']),
                formData,
                formErrors,
            });
        } else {
            res.cookie('thirdPartySubscriberCookie', JSON.stringify(formData), {
                secure: true,
                httpOnly: true,
            });
            res.redirect('/manage-third-party-subscriber-oauth-config-summary');
        }
    }
}
