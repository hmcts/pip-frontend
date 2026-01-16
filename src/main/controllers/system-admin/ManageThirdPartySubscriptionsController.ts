import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';
import { ThirdPartyService } from '../../service/ThirdPartyService';
import { cloneDeep } from 'lodash';

const thirdPartyService = new ThirdPartyService();

export default class ManageThirdPartySubscriptionsController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const thirdPartyUserId = req.query?.userId as string;
        if (thirdPartyUserId) {
            const subscriptions = await thirdPartyService.getThirdPartySubscriptionsByUserId(
                thirdPartyUserId,
                req.user['userId']
            );
            const listTypeSensitivityMapping = thirdPartyService.constructListTypeSensitivityMappings(subscriptions);

            res.render('system-admin/manage-third-party-subscriptions', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['manage-third-party-subscriptions']),
                subscriptions,
                listTypeSensitivityMapping,
                userId: thirdPartyUserId,
            });
            return;
        }
        res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        const map = new Map<string, string>(Object.entries(req.body));
        const listTypeMap = new Map([...map].filter(([k, v]) => k !== 'userId' && v !== 'EMPTY'));
        const thirdPartyUserId = req.body?.userId;

        const subscriptions = await thirdPartyService.getThirdPartySubscriptionsByUserId(
            thirdPartyUserId,
            req.user['userId']
        );

        if (!subscriptions && listTypeMap.size === 0) {
            const listTypeSensitivityMapping = thirdPartyService.constructListTypeSensitivityMappings(subscriptions);

            res.render('system-admin/manage-third-party-subscriptions', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['manage-third-party-subscriptions']),
                subscriptions,
                listTypeSensitivityMapping,
                userId: thirdPartyUserId,
                noSelectionError: true,
            });
            return;
        }

        if (listTypeMap.size > 0) {
            res.cookie('listTypeSensitivityCookie', JSON.stringify(Object.fromEntries(listTypeMap)), { secure: true });
        }
        res.redirect(`/manage-third-party-subscriptions-summary?userId=${thirdPartyUserId}`);
    }
}
