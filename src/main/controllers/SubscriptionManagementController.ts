import { Request, Response } from 'express';
import { TableService } from '../service/tableService';
import { SubscriptionActions } from '../resources/actions/subscriptionActions';

const tableService = new TableService();
const userId = 1;
const subscriptionsData = new SubscriptionActions().getUserSubscriptions(userId);

export default class SubscriptionManagementController {

  public get(req: Request, res: Response): void {
    const caseTableData = tableService.generateCaseTableRows(subscriptionsData);
    const courtTableData = tableService.generateCourtTableRows(subscriptionsData);
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
