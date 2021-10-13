import { Request, Response } from 'express';

export default class SubscriptionManagementController {
  public get(req: Request, res: Response): void {
    res.render('subscription-management');
  }
}
