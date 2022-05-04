import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';

export default class MediaAccountRequestSubmittedController {
  public get(req: PipRequest, res: Response): void {
    res.render('user-media-account-rejection',
      req.i18n.getDataByLanguage(req.lng)['user-media-account-rejection'],
    );
  }
}
