import {PipRequest} from '../models/request/PipRequest';
import {Response} from 'express';

export default class BulkCreateMediaAccountConfirmedController {
  public get(req: PipRequest, res: Response): void {
    res.render('bulk-create-media-account-confirmed', req.i18n.getDataByLanguage(req.lng)['bulk-create-media-account-confirmed']);
  }
}
