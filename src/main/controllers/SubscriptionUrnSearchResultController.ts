import { Response } from 'express';
import { PipRequest } from '../models/request/PipRequest';

import { cloneDeep } from 'lodash';
import {PublicationService} from '../service/publicationService';
import {UserService} from '../service/userService';

const publicationService = new PublicationService();
const userService = new UserService();

export default class SubscriptionUrnSearchResultController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    const searchInput = req.query['search-input'];
    if (searchInput && searchInput.length) {
      const userId = await userService.getPandIUserId('PI_AAD', req.user);
      const searchResults = await publicationService.getCaseByCaseUrn(searchInput.toString(), userId);
      searchResults ?
        res.render('subscription-urn-search-results', {
          ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['subscription-urn-search-results']),
          searchResults,
        }) :
        res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    } else {
      res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }
  }
}
