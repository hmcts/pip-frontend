import { PipRequest } from '../../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { PublicationService } from '../../service/PublicationService';
import { ThirdPartyService } from '../../service/ThirdPartyService';

const thirdPartyService = new ThirdPartyService();
const publicationService = new PublicationService();

export default class ManageThirdPartySubscriptionsSummaryController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const userId = req.query?.userId as string;
        if (userId) {
            const formData = req.cookies?.formCookie ? JSON.parse(req.cookies['formCookie']) : {};
            const listTypesMap = new Map<string, string>(Object.entries(formData));
            const listTypeNamesMap = new Map<string, string>();
            const allListTypes = publicationService.getListTypes();
            listTypesMap.forEach((value, key) => {
                if (allListTypes.has(key)) {
                    listTypeNamesMap.set(allListTypes.get(key).friendlyName, value);
                }
            });

            res.render('system-admin/manage-third-party-subscriptions-summary', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['manage-third-party-subscriptions-summary']),
                listTypeNamesMap,
                userId: userId,
            });
            return;
        }
        res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        const userId = req.body?.userId;
        const formData = req.cookies?.formCookie ? JSON.parse(req.cookies['formCookie']) : {};
        const listTypesMap = new Map<string, string>(Object.entries(formData));

        const subscriptions = await thirdPartyService.getThirdPartySubscriptionsByUserId(userId, req.user['userId']);
        const subscriptionsPresent = subscriptions && subscriptions.length > 0;

        const success = subscriptionsPresent
            ? await thirdPartyService.updateThirdPartySubscriptions(listTypesMap, userId, req.user['userId'])
            : await thirdPartyService.createThirdPartySubscriptions(listTypesMap, userId, req.user['userId']);

        if (success) {
            if (subscriptionsPresent) {
                res.redirect('/manage-third-party-subscriptions-updated-success');
            } else {
                res.redirect('/manage-third-party-subscriptions-created-success');
            }
        } else {
            const listTypeNamesMap = new Map<string, string>();
            listTypesMap.forEach((value, key) => {
                listTypeNamesMap.set(publicationService.getListTypes().get(key).friendlyName, value);
            });

            res.render('system-admin/manage-third-party-subscriptions-summary', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['manage-third-party-subscriptions-summary']),
                listTypeNamesMap,
                userId: userId,
                requestError: true,
            });
        }
    }
}
