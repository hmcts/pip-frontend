import { Request, Response } from 'express';


export default class AccountLockedController {
  public get(req: Request, res: Response): void {
    res.render('account-locked');
  }
}
