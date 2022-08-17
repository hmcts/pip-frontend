import { Response } from 'express';
import {cloneDeep} from 'lodash';
import { PipRequest } from '../models/request/PipRequest';
import { SubscriptionService } from '../service/subscriptionService';

const subscriptionService = new SubscriptionService();

export default class SubscriptionConfigureListController {
  public async get(req: PipRequest, res: Response): Promise<void> {

    const listTypes = await subscriptionService.generateListTypesForCourts(req.user['piUserId']);
    res.render('subscription-configure-list', {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['subscription-configure-list']),
      listTypes: listTypes
    });
  }
}
