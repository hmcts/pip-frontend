import {PipRequest} from '../models/request/PipRequest';
import {Response} from 'express';
import {cloneDeep} from 'lodash';
import {FileHandlingService} from '../service/fileHandlingService';
import {ManualUploadService} from '../service/manualUploadService';

const manualUploadService = new ManualUploadService();
const fileHandlingService = new FileHandlingService();

export default class ManualReferenceDataUploadSummaryController {
  public get(req: PipRequest, res: Response): void {
    const formData = (req.cookies?.formCookie) ? JSON.parse(req.cookies['formCookie']) : {};
    (req.query?.error === 'true') ?
      res.render('manual-reference-data-upload-summary', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['manual-reference-data-upload-summary']),
        displayError: true,
        fileUploadData: formData,
      }) :
      res.render('manual-reference-data-upload-summary', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['manual-reference-data-upload-summary']),
        displayError: false,
        fileUploadData: formData,
      });
  }

  public async post(req: PipRequest, res: Response): Promise<void> {
    const formData = (req.cookies?.formCookie) ? JSON.parse(req.cookies['formCookie']) : {};

    formData.file = await fileHandlingService.readFileFromRedis(req.user['userId'], formData.fileName);

    if (req.query?.check === 'true') {
      res.render('manual-reference-data-upload-summary', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['manual-reference-data-upload-summary']),
        displayError: false,
        fileUploadData: formData,
      });
    } else {
      const response = await manualUploadService.uploadLocationDataPublication({...formData});

      fileHandlingService.removeFileFromRedis(req.user['userId'], formData.fileName);

      if (response) {
        res.clearCookie('formCookie');
        res.redirect('manual-reference-data-upload-confirmation');
      } else {
        res.render('manual-reference-data-upload-summary', {
          ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['manual-reference-data-upload-summary']),
          fileUploadData: formData,
          displayError: true,
        });
      }
    }
  }
}
