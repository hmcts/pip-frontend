import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { PipRequest } from '../models/request/PipRequest';
import { SubscriptionService } from '../service/SubscriptionService';

const subscriptionService = new SubscriptionService();

export default class SubscriptionAddListController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const listTypes = await subscriptionService.generateListTypeForCourts(
            req.user['userProvenance'],
            req.lng,
            req.user['userId']
        );

        res.render('subscription-add-list', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['subscription-add-list']),
            listTypes: listTypes,
        });
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        if (!req.body) {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        } else {
            const result = subscriptionService.createListTypeSubscriptionPayload(req.body['list-selections[]']);

            if (result === undefined || result?.length == 0) {
                const listTypes = await subscriptionService.generateListTypeForCourts(
                    req.user['userProvenance'],
                    req.lng,
                    req.user['userId']
                );

                res.render('subscription-add-list', {
                    ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['subscription-add-list']),
                    listTypes: listTypes,
                    noSelectionError: true,
                });
            } else {
                await subscriptionService.handleNewSubscription(req.body, req.user);
                res.redirect('subscription-add-list-language');
            }
        }
    }
}
