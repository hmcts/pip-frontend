import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { ThirdPartyService } from '../../service/ThirdPartyService';
import { ThirdPartyRequests } from '../../resources/requests/ThirdPartyRequests';
import { KeyVaultService } from '../../service/KeyVaultService';

const thirdPartyService = new ThirdPartyService();
const thirdPartyRequests = new ThirdPartyRequests();
const keyVaultService = new KeyVaultService();

export default class ManageThirdPartySubscriberOathConfigController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        let formData = req.cookies?.thirdPartySubscriberCookie
            ? JSON.parse(req.cookies['thirdPartySubscriberCookie'])
            : {};

        const userId = req.query.userId as string;
        if (formData.user != userId) {
            formData = await thirdPartyRequests.getThirdPartySubscriberOathConfigByUserId(userId, req.user['userId']);
            const thirdPartySubscriber = await thirdPartyService.getThirdPartySubscriberById(
                userId,
                req.user['userId']
            );

            if (!formData || typeof formData !== 'object') {
                formData = {};
                formData.createConfig = 'true';
                formData.scopeKey = keyVaultService.createKeyVaultSecretName(
                    thirdPartySubscriber.name,
                    userId,
                    'scope'
                );
                formData.clientIdKey = keyVaultService.createKeyVaultSecretName(
                    thirdPartySubscriber.name,
                    userId,
                    'client-id'
                );
                formData.clientSecretKey = keyVaultService.createKeyVaultSecretName(
                    thirdPartySubscriber.name,
                    userId,
                    'client-secret'
                );
            } else {
                formData.scopeValue = await keyVaultService.getSecret(formData.scopeKey);
                formData.clientId = await keyVaultService.getSecret(formData.clientIdKey);
            }

            formData.user = userId;
        }

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
            res.cookie('thirdPartySubscriberCookie', JSON.stringify(formData), {
                secure: true,
                httpOnly: true,
            });
            res.redirect('/manage-third-party-subscriber-oath-config-summary');
        }
    }
}
