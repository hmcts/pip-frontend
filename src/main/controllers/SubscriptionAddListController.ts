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

        if (req.query.error === 'true') {
            res.render('subscription-add-list', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['subscription-add-list']),
                listTypes: listTypes,
                noSelectionError: true,
            });
        } else {
            res.render('subscription-add-list', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['subscription-add-list']),
                listTypes: listTypes,
                noSelectionError: false,
            });
        }
    }
}
