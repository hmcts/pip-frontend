import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { PipRequest } from '../models/request/PipRequest';
import { PublicationService } from '../service/PublicationService';
import * as url from 'url';
import { checkIfUrl } from '../helpers/urlHelper';

const publicationService = new PublicationService();

export default class CaseReferenceNumberSearchController {
    public get(req: PipRequest, res: Response): void {
        res.render('case-reference-number-search', req.i18n.getDataByLanguage(req.lng)['case-reference-number-search']);
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        const searchInput = req.body['search-input'] as string;
        if (searchInput && !checkIfUrl(searchInput)) {
            let searchResults = await publicationService.getCaseByCaseNumber(searchInput, req.user['userId']);

            if (searchResults) {
                res.redirect(
                    url.format({
                        pathname: 'case-reference-number-search-results',
                        query: {
                            'search-input': searchInput,
                            'search-type': 'case-number',
                        },
                    })
                );
            } else {
                searchResults = await publicationService.getCaseByCaseUrn(searchInput, req.user['userId']);
                searchResults
                    ? res.redirect(
                          url.format({
                              pathname: 'case-reference-number-search-results',
                              query: {
                                  'search-input': searchInput,
                                  'search-type': 'case-urn',
                              },
                          })
                      )
                    : res.render('case-reference-number-search', {
                          ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['case-reference-number-search']),
                          invalidInputError: false,
                          noResultsError: true,
                      });
            }
        } else {
            res.render('case-reference-number-search', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['case-reference-number-search']),
                invalidInputError: true,
                noResultsError: false,
            });
        }
    }
}
