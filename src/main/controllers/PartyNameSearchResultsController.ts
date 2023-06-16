import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { PublicationService } from '../service/publicationService';

const url = 'party-name-search-results';
const publicationService = new PublicationService();

export default class PartyNameSearchResultsController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        const searchQuery = req.query.search;
        if (searchQuery) {
            const searchResults = await publicationService.getCasesByPartyName(
                searchQuery.toString(),
                req.user?.['userId']
            );

            res.render(url, {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)[url]),
                searchResults,
            });
        } else {
            res.render('error', req.i18n.getDataByLanguage(req.lng).error);
        }
    }
}
