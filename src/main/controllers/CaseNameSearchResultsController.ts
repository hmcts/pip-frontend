import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { PipRequest } from '../models/request/PipRequest';
import { PublicationService } from '../service/PublicationService';
import { pendingCaseSubscriptionSorter } from '../helpers/sortHelper';
import { SubscriptionService } from '../service/SubscriptionService';

const publicationService = new PublicationService();
const subscriptionService = new SubscriptionService();

export default class CaseNameSearchResultsController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const searchQuery = req.query.search as string;
        if (searchQuery) {
            const searchResults = await publicationService.getCasesByCaseName(
                searchQuery.toString(),
                req.user?.['userId']
            );
            searchResults.sort(pendingCaseSubscriptionSorter);

            res.render('case-name-search-results', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['case-name-search-results']),
                searchResults,
            });
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        if (req.body) {
            await subscriptionService.handleNewSubscription(req.body, req.user);
            res.redirect('/pending-subscriptions');
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }
}
