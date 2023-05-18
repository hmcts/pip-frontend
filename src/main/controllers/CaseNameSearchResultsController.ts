import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { PipRequest } from '../models/request/PipRequest';
import { PublicationService } from '../service/publicationService';

const publicationService = new PublicationService();

export default class CaseNameSearchResultsController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const searchQuery = req.query.search;
        if (searchQuery) {
            const searchResults = await publicationService.getCasesByCaseName(
                searchQuery.toString(),
                req.user?.['userId']
            );

            const formattedResults = { numberResults: [], urnResults: [] };
            searchResults.forEach(searchResult => {
                if (searchResult.caseNumber) {
                    formattedResults.numberResults.push(searchResult);
                }

                if (searchResult.caseUrn) {
                    formattedResults.urnResults.push(searchResult);
                }
            });
            res.render('case-name-search-results', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['case-name-search-results']),
                formattedResults,
                numberOfResults: formattedResults.numberResults.length + formattedResults.urnResults.length,
            });
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }
}
