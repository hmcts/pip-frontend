import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';

export default class LocationDataManualUploadConfirmationController {
  public get(req: PipRequest, res: Response): void {
    res.render('location-data-upload-confirmation',
      req.i18n.getDataByLanguage(req.lng)['location-data-upload-confirmation']);
  }
}
