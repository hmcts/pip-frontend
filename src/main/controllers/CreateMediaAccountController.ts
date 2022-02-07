import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';

export default class CreateMediaAccountController {
  public get(req: PipRequest, res: Response): void {
    res.render('create-media-account', req.i18n.getDataByLanguage(req.lng)['create-media-account']);
  }

  public post(req: PipRequest, res: Response): void {
    console.log('req', req.body);
    res.render('create-media-account', req.i18n.getDataByLanguage(req.lng)['create-media-account']);
  }
}
