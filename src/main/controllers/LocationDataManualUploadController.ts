import {PipRequest} from '../models/request/PipRequest';
import {Response} from 'express';
import {cloneDeep} from 'lodash';
import {FileHandlingService} from '../service/fileHandlingService';
import {uploadType} from '../models/consts';

const fileHandlingService = new FileHandlingService();
export default class LocationDataManualUploadController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    const formValues = {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['location-data-manual-upload']),
    };
    res.render('location-data-manual-upload', formValues);
  }

  public async post(req: PipRequest, res: Response): Promise<void> {
    if (req.query?.showerror === 'true') {
      res.render('error', req.i18n.getDataByLanguage(req.lng).error);
    } else {
      const errors = {
        fileErrors: fileHandlingService.validateFileUpload(req.file, req.lng as string, 'location-data-manual-upload',
          uploadType.LOCATION),
      };

      const formValues = {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['location-data-manual-upload']),
        errors,
        formData: req.body,
      };

      if (errors.fileErrors) {
        res.render('location-data-manual-upload', formValues);
      } else {
        const originalFileName = req.file['originalname'];
        const sanitisedFileName = fileHandlingService.sanitiseFileName(originalFileName);
        await fileHandlingService.storeFileIntoRedis(req.user['oid'], originalFileName, sanitisedFileName);

        req.body['fileName'] = originalFileName;
        res.cookie('formCookie', JSON.stringify(req.body));
        res.redirect('/location-data-manual-upload-summary?check=true');
      }
    }
  }
}
