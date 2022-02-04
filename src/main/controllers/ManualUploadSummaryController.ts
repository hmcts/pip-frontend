import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { ManualUploadService } from '../service/manualUploadService';

const manualUploadService = new ManualUploadService();

export default class ManualUploadSummaryController {
  public get(req: PipRequest, res: Response): void {
    const formData = JSON.parse(req.cookies['formCookie']);
    (req.query?.error === 'true') ?
      res.render('file-upload-summary', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['file-upload-summary']),
        fileUploadData: {...manualUploadService.formatPublicationDates(formData, false)},
        displayError: true,
      }) :
      res.render('file-upload-summary', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['file-upload-summary']),
        displayError: false,
        fileUploadData: {...manualUploadService.formatPublicationDates(formData, false)},
      });
  }

  public async post(req: PipRequest, res: Response): Promise<void> {
    // TODO: remove this after AAD is fully functional AAD = oid, mock = id
    const userId = req.user['id'] ? req.user['id'] : req.user['oid'];
    const formData = JSON.parse(req.cookies['formCookie']);
    formData.file = manualUploadService.readFile(formData.fileName);

    if (req.query?.check === 'true') {
      res.render('file-upload-summary', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['file-upload-summary']),
        displayError: false,
        fileUploadData: {...manualUploadService.formatPublicationDates(formData, false)},
      });
    } else {
      const response = await manualUploadService.uploadPublication({...formData, userId}, true);
      manualUploadService.removeFile(formData.fileName);
      if (response) {
        res.clearCookie('formCookie');
        res.redirect('upload-confirmation');
      } else {
        res.render('file-upload-summary', {
          ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['file-upload-summary']),
          fileUploadData: {...manualUploadService.formatPublicationDates(formData, false)},
          displayError: true,
        });
      }
    }
  }
}
