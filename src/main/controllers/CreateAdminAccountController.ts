import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';

export default class CreateAdminAccountController {
  public get(req: PipRequest, res: Response): void {
    res.render('create-admin-account', req.i18n.getDataByLanguage(req.lng)['create-admin-account']);
  }

  public post(req: PipRequest, res: Response): void {
    res.render('create-admin-account', req.i18n.getDataByLanguage(req.lng)['create-admin-account']);
  }
}
