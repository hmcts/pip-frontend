import {PipRequest} from '../models/request/PipRequest';
import {Response} from 'express';
import {FileHandlingService} from '../service/fileHandlingService';
import {cloneDeep} from 'lodash';

const fileHandlingService = new FileHandlingService();

export default class BulkCreateMediaAccountController {
  public get(req: PipRequest, res: Response): void {
    res.render('bulk-create-media-account', {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['bulk-create-media-account']),
      displayError: false,
    });
  }

  public async post(req: PipRequest, res: Response): Promise<void> {
    const error = fileHandlingService.validateFileUpload(req.file, req.lng as string, 'bulk-create-media-account');
    if (error === null) {
      const originalFileName = req.file['originalname'];
      const sanitisedFileName = fileHandlingService.sanitiseFileName(originalFileName);
      await fileHandlingService.storeFileIntoRedis(req.user['oid'], originalFileName, sanitisedFileName);
      res.cookie('uploadFilename', sanitisedFileName);
      res.redirect('/bulk-create-media-account-confirmation');
    } else {
      res.render('bulk-create-media-account', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['bulk-create-media-account']),
        displayError: true,
        error,
      });
    }
  }
}
