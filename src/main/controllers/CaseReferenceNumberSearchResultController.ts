import { Response } from 'express';
import { PipRequest } from '../models/request/PipRequest';
import { cloneDeep } from 'lodash';
import { PublicationService } from '../service/publicationService';

const publicationService = new PublicationService();

export default class CaseReferenceNumberSearchResultController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const searchInput = req.query['search-input'] as string;
        const searchType = req.query['search-type'] as string;
        let searchResults = null;
        let urnSearch = false;

        switch (searchType) {
            case 'case-number': {
                searchResults = await publicationService.getCaseByCaseNumber(searchInput, req.user?.['userId']);
                break;
            }
            case 'case-urn': {
                searchResults = await publicationService.getCaseByCaseUrn(searchInput, req.user?.['userId']);
                urnSearch = true;
                break;
            }
        }

        if (searchResults) {
            res.render('case-reference-number-search-results', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['case-reference-number-search-results']),
                searchInput,
                searchResults,
                urnSearch,
            });
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }
}
