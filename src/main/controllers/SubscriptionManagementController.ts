import { Request, Response } from 'express';
import { SubscriptionService } from '../service/subscriptionService';
import { SubscriptionActions } from '../resources/actions/subscriptionActions';

const subscriptionService = new SubscriptionService();
const userId = 1;
const subscriptionsData = new SubscriptionActions().getUserSubscriptions(userId);

export default class SubscriptionManagementController {

  public get(req: Request, res: Response): void {
    const caseTableData = subscriptionService.generateCaseTableRows(subscriptionsData);
    const courtTableData = subscriptionService.generateCourtTableRows(subscriptionsData);
    let activeAllTab, activeCaseTab, activeCourtTab = false;
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
    res.render('subscription-management', {caseTableData, courtTableData, activeAllTab, activeCaseTab, activeCourtTab});
  }
}
