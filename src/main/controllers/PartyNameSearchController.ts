import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { PublicationService } from '../service/publicationService';

const url = 'party-name-search';
const publicationService = new PublicationService();

export default class PartyNameSearchController {
    public get(req: PipRequest, res: Response): void {
        res.render(url, {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)[url]),
            noResultsError: req.query.error === 'true',
        });
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        const searchInput = req.body['party-name'];

        if (searchInput && searchInput.length >= 3) {
            const searchResults = await publicationService.getCasesByPartyName(
                searchInput.toLowerCase(),
                req.user['userId']
            );
            if (searchResults.length > 0) {
                res.redirect('party-name-search-results?search=' + searchInput);
            } else {
                res.render(url, {
                    ...cloneDeep(req.i18n.getDataByLanguage(req.lng)[url]),
                    noResultsError: true,
                });
            }
        } else {
            res.render(url, {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)[url]),
                minimumCharacterError: true,
            });
        }
    }
}
