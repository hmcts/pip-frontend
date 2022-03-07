import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';

export default class AdminDashboardController {
  public get(req: PipRequest, res: Response): void {
    res.render('admin-dashboard', req.i18n.getDataByLanguage(req.lng)['admin-dashboard']);
  }
}
