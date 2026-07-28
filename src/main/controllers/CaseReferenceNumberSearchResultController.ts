import { Response } from 'express';
import { PipRequest } from '../models/request/PipRequest';
import { cloneDeep } from 'lodash';
import { PublicationService } from '../service/PublicationService';
import { SubscriptionService } from '../service/SubscriptionService';

const publicationService = new PublicationService();
const subscriptionService = new SubscriptionService();

export default class CaseReferenceNumberSearchResultController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const searchInput = req.query['search-input'] as string;
        const searchResults = await publicationService.getCaseByCaseNumber(searchInput, req.user?.['userId']);

        if (searchResults) {
            res.render('case-reference-number-search-results', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['case-reference-number-search-results']),
                searchInput,
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
