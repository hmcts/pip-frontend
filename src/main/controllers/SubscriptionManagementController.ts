import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { SubscriptionService } from '../service/subscriptionService';
import { cloneDeep } from 'lodash';

const subscriptionService = new SubscriptionService();

export default class SubscriptionManagementController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    if (req.user) {
      const subscriptionData = await subscriptionService.getSubscriptionsByUser(req.user['piUserId']);
      const caseTableData = await subscriptionService.generateCaseTableRows(subscriptionData.caseSubscriptions);
      const locationTableData = await subscriptionService.generateLocationTableRows(subscriptionData.locationSubscriptions);
      let activeAllTab = false, activeCaseTab = false, activeLocationTab = false;
      switch (Object.keys(req.query)[0]) {
        case 'all':
          activeAllTab = true;
          break;
        case 'case':
          activeCaseTab = true;
          break;
        case 'location':
          activeLocationTab = true;
          break;
        default:
          activeAllTab = true;
          break;
      }
      res.render('subscription-management', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['subscription-management']),
        caseTableData,
        locationTableData,
        activeAllTab,
        activeCaseTab,
        activeLocationTab,
      });
    } else {
      res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }
  }
}
