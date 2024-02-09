import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { PipRequest } from '../models/request/PipRequest';
import { PublicationService } from '../service/publicationService';
import { pendingCaseSubscriptionSorter } from '../helpers/sortHelper';

const publicationService = new PublicationService();

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
}
