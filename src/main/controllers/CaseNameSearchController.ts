import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { PipRequest } from '../models/request/PipRequest';
import { PublicationService } from '../service/publicationService';

const publicationService = new PublicationService();

export default class CaseNameSearchController {
    public get(req: PipRequest, res: Response): void {
        if (req.query.error === 'true') {
            res.render('case-name-search', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['case-name-search']),
                noResultsError: true,
            });
        } else {
            res.render('case-name-search', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['case-name-search']),
            });
        }
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        const searchInput = req.body['case-name'];

        if (searchInput && searchInput.length >= 3) {
            const searchResults = await publicationService.getCasesByCaseName(
                searchInput.toLowerCase(),
                req.user['userId']
            );
            if (searchResults.length > 0) {
                res.redirect('case-name-search-results?search=' + searchInput);
            } else {
                res.render('case-name-search', {
                    ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['case-name-search']),
                    noResultsError: true,
                });
            }
        } else {
            res.render('case-name-search', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['case-name-search']),
                minimumCharacterError: true,
            });
        }
    }
}
