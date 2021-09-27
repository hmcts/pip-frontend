import { Request, Response } from 'express';
import { SubscriptionActions } from '../resources/actions/subscriptionActions';

export default class SubscriptionManagementController {
  public get(req: Request, res: Response): void {
    const subscriptionActions = new SubscriptionActions();
    const caseTableData = subscriptionActions.generateCaseTableRows();
    const courtTableData = subscriptionActions.generateCourtTableRows();
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
