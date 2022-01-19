import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { SubscriptionService } from '../service/subscriptionService';
import { cloneDeep } from 'lodash';

const subscriptionService = new SubscriptionService();

export default class SubscriptionManagementController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    if (req.user) {
      const subscriptionData = await subscriptionService.getSubscriptionsByUser(req.user['id']);
      const caseTableData = await subscriptionService.generateCaseTableRows(subscriptionData.caseSubscriptions);
      const courtTableData = await subscriptionService.generateCourtTableRows(subscriptionData.courtSubscriptions);
      let activeAllTab = false, activeCaseTab = false, activeCourtTab = false;
      switch (Object.keys(req.query)[0]) {
        case 'all':
          activeAllTab = true;
          break;
        case 'case':
          activeCaseTab = true;
          break;
        case 'court':
          activeCourtTab = true;
          break;
        default:
          activeAllTab = true;
          break;
      }
      res.render('subscription-management', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['subscription-management']),
        caseTableData,
        courtTableData,
        activeAllTab,
        activeCaseTab,
        activeCourtTab,
      });
    } else {
      res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }
  }
}
