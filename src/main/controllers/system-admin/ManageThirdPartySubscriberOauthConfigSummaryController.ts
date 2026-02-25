import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { ThirdPartyService } from '../../service/ThirdPartyService';
import { UserManagementService } from '../../service/UserManagementService';
import { KeyVaultService } from '../../service/KeyVaultService';

const thirdPartyService = new ThirdPartyService();
const userManagementService = new UserManagementService();
const keyVaultService = new KeyVaultService();

export default class ManageThirdPartySubscriberOauthConfigSummaryController {
    public get(req: PipRequest, res: Response): void {
        const formData = req.cookies?.thirdPartySubscriberCookie
            ? JSON.parse(req.cookies['thirdPartySubscriberCookie'])
            : {};
        res.render('system-admin/manage-third-party-subscriber-oauth-config-summary', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['manage-third-party-subscriber-oauth-config-summary']),
            formData,
            displayError: false,
        });
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        const formData = req.cookies?.thirdPartySubscriberCookie
            ? JSON.parse(req.cookies['thirdPartySubscriberCookie'])
            : {};

        const requesterId = req.user?.['userId'];
        const response = formData.createConfig
            ? await thirdPartyService.createThirdPartySubscriberOauthConfig(formData, requesterId)
            : await thirdPartyService.updateThirdPartySubscriberOauthConfig(formData, requesterId);

        if (response) {
            const oauthConfig = await thirdPartyService.getThirdPartySubscriberOauthConfigByUserId(
                formData.user,
                requesterId
            );

            if (oauthConfig) {
                await Promise.all([
                    keyVaultService.createOrUpdateSecret(oauthConfig.scopeKey, formData.scope),
                    keyVaultService.createOrUpdateSecret(oauthConfig.clientIdKey, formData.clientId),
                    keyVaultService.createOrUpdateSecret(oauthConfig.clientSecretKey, formData.clientSecret),
                ]);

                await userManagementService.auditAction(
                    req.user,
                    'THIRD_PARTY_SUBSCRIBER_OAUTH_CONFIG_CREATED',
                    `Third party oauth config created successfully`
                );
                res.clearCookie('thirdPartySubscriberCookie');
                res.redirect('/manage-third-party-subscriber-oauth-config-success');
                return;
            }
        }

        res.render('system-admin/manage-third-party-subscriber-oauth-config-summary', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['manage-third-party-subscriber-oauth-config-summary']),
            formData,
            displayError: true,
        });
    }
}
