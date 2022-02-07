import { Response } from 'express';
import { PipRequest } from '../models/request/PipRequest';

import { cloneDeep } from 'lodash';
import { HearingService } from '../service/hearingService';

const hearingService = new HearingService();

export default class SubscriptionUrnSearchResultController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    const searchInput = req.query['search-input'];
    if (searchInput && searchInput.length) {
      const searchResults = await hearingService.getCaseByURN(searchInput.toString());
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
