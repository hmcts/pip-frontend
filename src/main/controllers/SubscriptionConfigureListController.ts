import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { PipRequest } from '../models/request/PipRequest';
import { SubscriptionService } from '../service/SubscriptionService';

const subscriptionService = new SubscriptionService();

export default class SubscriptionConfigureListController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const listTypes = await subscriptionService.generateListTypesForCourts(
            req.user['userId'],
            req.user['userProvenance'],
            req.lng
        );

        res.render('subscription-configure-list', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['subscription-configure-list']),
            listTypes,
        });
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        const result = subscriptionService.createListTypeSubscriptionPayload(req.body['list-selections[]']);

        if (result === undefined || result?.length == 0) {
            const listTypes = await subscriptionService.generateListTypesForCourts(
                req.user['userId'],
                req.user['userProvenance'],
                req.lng
            );

            res.render('subscription-configure-list', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['subscription-configure-list']),
                listTypes,
                noSelectionError: true,
            });
        } else {
            await subscriptionService.handleNewSubscription(req.body, req.user);
            res.redirect('subscription-configure-list-language');
        }
    }
}
