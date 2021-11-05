import { Response } from 'express';
import { PipRequest } from '../models/request/PipRequest';


export default class MockSessionController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    let userSet = false;
    if (req.user) {
      const userDetails = req.user;
      userSet = true;
      res.render('session-management', {haveUser: userSet, userDetails});
    } else {
      res.render('session-management', {haveUser: userSet});
    }
  }
}

