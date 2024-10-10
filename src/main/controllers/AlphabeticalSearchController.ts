import { Response } from 'express';
import { PipRequest } from '../models/request/PipRequest';
import { cloneDeep } from 'lodash';
import { FilterService } from '../service/FilterService';
import {SubscriptionService} from "../service/SubscriptionService";

const filterService = new FilterService();
const subscriptionService = new SubscriptionService();

export default class AlphabeticalSearchController {
    public async get(req: PipRequest, res: Response, page: string): Promise<void> {
        const initialisedFilter = await filterService.handleFilterInitialisation(
            req.query?.clear as string,
            req.query?.filterValues as string,
            req.lng
        );

        res.render(page, {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)[page]),
            locationList: initialisedFilter['alphabetisedList'],
            filterOptions: initialisedFilter['filterOptions'],
        });
    }

    public async post(req: PipRequest, res: Response, page: string): Promise<void> {
        const filterValues = filterService.generateFilterKeyValues(req.body);
        res.redirect(`${page}?filterValues=${filterValues}`);
    }

    public async locationSubscriptionsConfirmation(req: PipRequest, res: Response): Promise<void> {
        await subscriptionService.handleNewSubscription(req.body, req.user);
        res.redirect('/pending-subscriptions');
    }
}
