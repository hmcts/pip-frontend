import { Request, Response } from 'express';
import { SubscriptionActions } from '../resources/actions/subscriptionActions';

export default class SubscriptionManagementController {
  public get(req: Request, res: Response): void {
    const subscriptionActions = new SubscriptionActions();
    const caseTableData = subscriptionActions.generateCaseTableRows();
    const courtTableData = subscriptionActions.generateCourtTableRows();
    let activeAllTab, activeCaseTab, activeCourtTab;
    switch (Object.keys(req.query)[0]) {
      case 'all':
        activeAllTab = true;
        activeCaseTab = false;
        activeCourtTab = false;
        break;
      case 'case':
        activeAllTab = false;
        activeCaseTab = true;
        activeCourtTab = false;
        break;
      case 'court':
        activeAllTab = false;
        activeCaseTab = false;
        activeCourtTab = true;
        break;
      default:
        activeAllTab = true;
        activeCaseTab = false;
        activeCourtTab = false;
        break;
    }
    res.render('subscription-management', {caseTableData, courtTableData, activeAllTab, activeCaseTab, activeCourtTab});
  }
}
