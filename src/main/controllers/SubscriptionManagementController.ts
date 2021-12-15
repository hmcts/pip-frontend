import {PipRequest} from '../models/request/PipRequest';
import { Response } from 'express';
import { SubscriptionService } from '../service/subscriptionService';
import {cloneDeep} from 'lodash';

const subscriptionService = new SubscriptionService();

export default class SubscriptionManagementController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    if (req.user) {
      // currently only 2 users are mocked, userId: 1 has subscriptions, userId: 2 doesnt
      const userId = req.user['id'] === '1' ? 1 : 2;
      const tableData = await subscriptionService.generateSubscriptionsTableRows(userId);
      if (tableData) {
        const caseTableData = tableData.cases;
        const courtTableData = tableData.courts;
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
      }
      else {
        res.render('error', req.i18n.getDataByLanguage(req.lng).error);
      }

    } else {
      res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    }
  }
}
