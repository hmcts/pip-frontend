import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import {ManualUploadService} from '../service/manualUploadService';
import {cloneDeep} from 'lodash';

const manualUploadService = new ManualUploadService();

export default class ManualUploadController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    const listItems = await manualUploadService.buildFormData();
    const formValues = {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['manual-upload']),
      listItems,
    };
    res.render('manual-upload', formValues);
  }

  public async post(req: PipRequest, res: Response): Promise<void> {
    const errors = {
      fileErrors: manualUploadService.validateFileUpload(req.file),
      formErrors: await manualUploadService.validateFormFields(req.body),
    };
    console.log(req.file);

    const listItems = await manualUploadService.buildFormData();
    const formValues = {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['manual-upload']),
      listItems,
      errors,
    };

    if (errors.fileErrors || errors.formErrors) {
      res.render('manual-upload', formValues);
    } else {
      req.body['court'] = await manualUploadService.appendCourtId(req.body['input-autocomplete']);
      req.body['artefactType'] = 'LIST'; //Agreed on defaulting to only option available until more types become ready
      res.cookie('formCookie', JSON.stringify(req.body));
      res.redirect('/manual-upload-summary?check=true');
    }
  }
}
