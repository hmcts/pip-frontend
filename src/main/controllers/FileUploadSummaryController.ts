import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { AdminService } from '../service/adminService';

const adminService = new AdminService();

export default class FileUploadSummaryController {
  public get(req: PipRequest, res: Response): void {
    const formData = JSON.parse(req.cookies['formCookie']);
    (req.query?.error === 'true') ?
      res.render('file-upload-summary', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['file-upload-summary']),
        fileUploadData: {...adminService.formatPublicationDates(formData, false)},
        displayError: true,
      }) :
      res.render('file-upload-summary', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['file-upload-summary']),
        displayError: false,
        fileUploadData: {...adminService.formatPublicationDates(formData, false)},
      });
  }

  public async post(req: PipRequest, res: Response): Promise<void> {
    // TODO: remove this after AAD is fully functional AAD = oid, mock = id
    const userId = req.user['id'] ? req.user['id'] : req.user['oid'];
    const formData = JSON.parse(req.cookies['formCookie']);
    formData.file = adminService.readFile(formData.fileName);

    if (req.query?.check === 'true') {
      res.render('file-upload-summary', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['file-upload-summary']),
        displayError: false,
        fileUploadData: {...adminService.formatPublicationDates(formData, false)},
      });
    } else {
      const response = await adminService.uploadPublication({...formData, userId}, true);
      adminService.removeFile(formData.fileName);
      (response) ?
        res.redirect('upload-confirmation') :
        res.render('file-upload-summary', {
          ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['file-upload-summary']),
          fileUploadData: {...adminService.formatPublicationDates(formData, false)},
          displayError: true,
        });
    }
  }
}
