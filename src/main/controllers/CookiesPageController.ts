import { Response } from 'express';
import { PipRequest } from '../models/request/PipRequest';

export default class CookiesPageController {
  public get(req: PipRequest, res: Response): void {
    res.render('cookies', req.i18n.getDataByLanguage(req.lng)['cookies']);
  }
}
