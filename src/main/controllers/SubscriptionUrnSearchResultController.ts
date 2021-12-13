import { Response } from 'express';
import { PipRequest } from '../models/request/PipRequest';
import { SubscriptionService } from '../service/subscriptionService';
import validateRendering from '../common/utils';

const subscriptionService = new SubscriptionService();

export default class SubscriptionUrnSearchResultController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    const searchInput = req.query['search-input'];
    (searchInput && searchInput.length) ?
      validateRendering(
        await subscriptionService.getSubscriptionUrnDetails(searchInput.toString()),
        'subscription-urn-search-results',
        req,
        res,
        searchInput) :
      res.render('error', req.i18n.getDataByLanguage(req.lng).error);
  }
}
