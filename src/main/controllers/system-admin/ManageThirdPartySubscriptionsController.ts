import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';
import { ThirdPartyService } from '../../service/ThirdPartyService';
import { cloneDeep } from 'lodash';

const thirdPartyService = new ThirdPartyService();

export default class ManageThirdPartySubscriptionsController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const userId = req.query?.userId as string;
        if (userId) {
            const subscriptions = await thirdPartyService.getThirdPartySubscriptionsByUserId(
                userId,
                req.user['userId']
            );
            const listTypeSensitivityMapping = thirdPartyService.constructListTypeSensitivityMappings(subscriptions);

            res.render('system-admin/manage-third-party-subscriptions', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['manage-third-party-subscriptions']),
                subscriptions,
                listTypeSensitivityMapping,
                userId,
            });
            return;
        }
        res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }

    public post(req: PipRequest, res: Response): void {
        const map = new Map<string, string>(Object.entries(req.body));
        const listTypeMap = new Map([...map].filter(([k, v]) => k !== 'userId' && v !== 'EMPTY'));
        const userId = req.body?.userId;

        res.cookie('formCookie', JSON.stringify(Object.fromEntries(listTypeMap)), { secure: true });
        res.redirect(`/manage-third-party-subscriptions-summary?userId=${userId}`);
    }
}
