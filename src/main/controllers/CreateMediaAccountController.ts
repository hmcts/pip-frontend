import {PipRequest} from '../models/request/PipRequest';
import {Response} from 'express';
import {CreateAccountService} from '../service/createAccountService';
import {cloneDeep} from 'lodash';
import {ManualUploadService} from '../service/manualUploadService';

const createAccountService = new CreateAccountService();
const manualUploadService = new ManualUploadService();

export default class CreateMediaAccountController {
  public get(req: PipRequest, res: Response): void {
    const formCookie = req.cookies['formCookie'];
    const formData = formCookie ? JSON.parse(formCookie) : null;
    res.render('create-media-account',
      {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['create-media-account']),
        formData: formData,
      });
  }

  public async post(req: PipRequest, res: Response): Promise<void> {
    const errors = {
      fileErrors: createAccountService.validateFileUpload(req.file),
      formErrors: createAccountService.validateFormFields(req.body),
    };

    const isValidForm = Object.values(errors.formErrors).every(o => o.message === null);
    if (errors.fileErrors || !isValidForm) {
      res.cookie('formCookie', JSON.stringify(req.body));
      res.render('create-media-account', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['create-media-account']),
        errors: errors,
        formData: req.body,
      });
    } else {
      req.body.file = manualUploadService.readFile(req.file['originalname']);
      req.body.fileName = req.file['originalname'];
      const application = await createAccountService.uploadCreateAccount({...req.body});
      const reference = application ? createAccountService.formatReference(application.applicationId) : null;
      manualUploadService.removeFile(req.body.fileName);
      if (reference) {
        res.clearCookie('formCookie');
        res.redirect('/account-request-submitted?reference=' + reference);
      } else {
        res.render('error', req.i18n.getDataByLanguage(req.lng).error);
      }
    }
  }
}
