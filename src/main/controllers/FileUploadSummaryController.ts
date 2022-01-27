import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';

export default class FileUploadSummaryController {
  public async post(req: PipRequest, res: Response): Promise<void> {
    // file upload service call here and if else render

    res.render('file-upload-summary', {...cloneDeep(req.i18n.getDataByLanguage(req.lng)['file-upload-summary']), displayError: false});
  }

  public get(req: PipRequest, res: Response): void {
    (req.query?.error === 'true') ?
      res.render('file-upload-summary', {...cloneDeep(req.i18n.getDataByLanguage(req.lng)['file-upload-summary']), displayError: true}) :
      res.render('file-upload-summary', {...cloneDeep(req.i18n.getDataByLanguage(req.lng)['file-upload-summary']), displayError: false});
  }
}
