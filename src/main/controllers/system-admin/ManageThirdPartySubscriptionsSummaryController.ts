import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { ThirdPartyService } from '../../service/ThirdPartyService';

const thirdPartyService = new ThirdPartyService();

export default class ManageThirdPartySubscriptionsSummaryController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const thirdPartyUserId = req.query?.userId as string;
        if (thirdPartyUserId) {
            const formData = req.cookies?.listTypeSensitivityCookie
                ? JSON.parse(req.cookies.listTypeSensitivityCookie)
                : {};

            // Map list type keys to their friendly names for display
            const listTypeNameMap = thirdPartyService.replaceListTypeKeysWithFriendlyNames(formData);

            res.render('system-admin/manage-third-party-subscriptions-summary', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['manage-third-party-subscriptions-summary']),
                listTypeNameMap,
                userId: thirdPartyUserId,
            });
            return;
        }
        res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        const thirdPartyUserId = req.body?.userId;
        const formData = req.cookies?.listTypeSensitivityCookie
            ? JSON.parse(req.cookies.listTypeSensitivityCookie)
            : {};

        const subscriptions = await thirdPartyService.getThirdPartySubscriptionsByUserId(
            thirdPartyUserId,
            req.user['userId']
        );
        const subscriptionsPresent = subscriptions && subscriptions.length > 0;

        const success = subscriptionsPresent
            ? await thirdPartyService.updateThirdPartySubscriptions(formData, thirdPartyUserId, req.user['userId'])
            : await thirdPartyService.createThirdPartySubscriptions(formData, thirdPartyUserId, req.user['userId']);

        if (success) {
            if (subscriptionsPresent) {
                res.redirect('/manage-third-party-subscriptions-updated-success');
            } else {
                res.redirect('/manage-third-party-subscriptions-created-success');
            }
        } else {
            // Map list type keys to their friendly names for display
            const listTypeNameMap = thirdPartyService.replaceListTypeKeysWithFriendlyNames(formData);

            res.render('system-admin/manage-third-party-subscriptions-summary', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['manage-third-party-subscriptions-summary']),
                listTypeNameMap,
                userId: thirdPartyUserId,
                requestError: true,
            });
        }
    }
}
