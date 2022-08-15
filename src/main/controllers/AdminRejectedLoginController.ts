import { Response } from 'express';
import { PipRequest } from '../models/request/PipRequest';

export default class AdminRejectedLoginController {
  public get(req: PipRequest, res: Response): void {
    res.render('admin-rejected-login', req.i18n.getDataByLanguage(req.lng)['admin-rejected-login']);
  }
}
