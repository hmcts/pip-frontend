import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { PipRequest } from '../models/request/PipRequest';
import { SubscriptionService } from '../service/subscriptionService';
import { FilterService } from '../service/filterService';

const subscriptionService = new SubscriptionService();
const filterService = new FilterService();

export default class SubscriptionConfigureListController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const listTypes = await subscriptionService.generateListTypesForCourts(
            req.user['userId'],
            req.user['userProvenance'],
            req.query?.filterValues as string,
            req.query?.clear as string,
            req.lng
        );

        res.render('subscription-configure-list', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['subscription-configure-list']),
            listTypes: listTypes['listOptions'],
            filterOptions: listTypes['filterOptions'],
        });
    }

    public async filterValues(req: PipRequest, res: Response): Promise<void> {
        const filterValues = filterService.generateFilterKeyValues(req.body);
        res.redirect(`subscription-configure-list?filterValues=${filterValues}`);
    }
}
