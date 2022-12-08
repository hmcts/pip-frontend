import { Response } from 'express';
import { PipRequest } from '../models/request/PipRequest';
import { cloneDeep } from 'lodash';
import {PublicationService} from '../service/publicationService';

const publicationService = new PublicationService();

export default class SubscriptionUrnSearchController {
  public get(req: PipRequest, res: Response): void {
    res.render('subscription-urn-search', req.i18n.getDataByLanguage(req.lng)['subscription-urn-search']);
  }

  public async post(req: PipRequest, res: Response): Promise<void> {
    const searchInput = req.body['search-input'];

    if (searchInput && searchInput.length) {
      const searchResults = await publicationService.getCaseByCaseUrn(searchInput, req.user?.['userId']);

      (searchResults) ?
        res.redirect(`subscription-urn-search-results?search-input=${searchInput}`) :
        res.render('subscription-urn-search', {
          ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['subscription-urn-search']),
          invalidInputError: false,
          noResultsError: true,
        });
    } else {
      res.render('subscription-urn-search', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['subscription-urn-search']),
        invalidInputError: true,
        noResultsError: false,
      });
    }
  }
}
