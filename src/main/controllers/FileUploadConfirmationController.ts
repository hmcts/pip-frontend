import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';

export default class FileUploadConfirmationController {
  public get(req: PipRequest, res: Response): void {
    res.render('success-view', req.i18n.getDataByLanguage(req.lng)['file-upload-confirm']);
  }
}
