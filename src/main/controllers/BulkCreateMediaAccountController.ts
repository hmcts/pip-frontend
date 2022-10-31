import {PipRequest} from '../models/request/PipRequest';
import {Response} from 'express';
import {FileHandlingService} from '../service/fileHandlingService';
import {cloneDeep} from 'lodash';
import {uploadType} from '../models/consts';

const fileHandlingService = new FileHandlingService();
let formCookie;

export default class BulkCreateMediaAccountController {
  public get(req: PipRequest, res: Response): void {
    formCookie = req.cookies['formCookie'];
    const formData = formCookie ? JSON.parse(formCookie) : null;
    res.render('bulk-create-media-account', {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['bulk-create-media-account']),
      displayError: false,
      formData,
    });
  }

  public async post(req: PipRequest, res: Response): Promise<void> {
    const formData = req.body;
    const error = fileHandlingService.validateFileUpload(req.file, req.lng as string, 'bulk-create-media-account', uploadType.FILE);
    if (error === null) {
      const originalFileName = req.file['originalname'];
      const sanitisedFileName = fileHandlingService.sanitiseFileName(originalFileName);
      await fileHandlingService.storeFileIntoRedis(req.user['oid'], originalFileName, sanitisedFileName, true);
      formData.uploadFileName = originalFileName;
      res.cookie('formCookie', JSON.stringify(formData));
      res.redirect('/bulk-create-media-account-confirmation');
    } else {
      res.render('bulk-create-media-account', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['bulk-create-media-account']),
        formData,
        displayError: true,
        error,
      });
    }
  }
}
