import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { AdminService } from '../service/adminService';

const adminService = new AdminService();

export default class FileUploadSummaryController {
  public async post(req: PipRequest, res: Response): Promise<void> {
    // TODO: remove this after AAD is fully functional AAD = oid, mock = id
    const userId = req.user['id'] ? req.user['id'] : req.user['oid'];

    if (req.query?.check === 'true') {
      res.render('file-upload-summary', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['file-upload-summary']),
        displayError: false,
        fileUploadData: {...adminService.formatPublicationDates(req.body, true), fileData: {...req['file']}, userId},
      });
    } else {
      const response = await adminService.uploadPublication({...adminService.formatPublicationDates(req.body, false), fileData: {...req['file']}, userId});
      (response) ?
        res.redirect('upload-confirmation') :
        res.render('file-upload-summary', {
          ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['file-upload-summary']),
          fileUploadData: {...adminService.formatPublicationDates(req.body, true), fileData: {...req['file']}, userId},
          displayError: true,
        });
    }
  }

  public get(req: PipRequest, res: Response): void {
    (req.query?.error === 'true') ?
      res.render('file-upload-summary', {...cloneDeep(req.i18n.getDataByLanguage(req.lng)['file-upload-summary']), displayError: true}) :
      res.render('file-upload-summary', {...cloneDeep(req.i18n.getDataByLanguage(req.lng)['file-upload-summary']), displayError: false});
  }
}
