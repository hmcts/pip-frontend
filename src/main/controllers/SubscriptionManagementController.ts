import { Request, Response } from 'express';

export interface AuthenticatedRequest extends Request {
  user: any // or any other type
}

export default class SubscriptionManagementController {
  public get(req: AuthenticatedRequest, res: Response): void {
    res.render('subscription-management', {user: req.user.displayName});
  }
}
