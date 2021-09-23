import { Request, Response } from 'express';
import { SubscriptionActions } from '../resources/actions/subscriptionActions';


export default class SubscriptionManagementController {
  public get(req: Request, res: Response): void {
    const subscriptionActions = new SubscriptionActions();
    const caseTableData = subscriptionActions.generateCaseTableRows();
    const courtTableData = subscriptionActions.generateCourtTableRows();
    res.render('subscription-management', {caseTableData, courtTableData});
  }
}
