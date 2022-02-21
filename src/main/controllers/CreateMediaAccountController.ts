import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { CreateAccountService } from '../service/createAccountService';
import { cloneDeep } from 'lodash';

const createAccountService = new CreateAccountService();

export default class CreateMediaAccountController {
  public get(req: PipRequest, res: Response): void {
    res.render('create-media-account', req.i18n.getDataByLanguage(req.lng)['create-media-account']);
  }

  public post(req: PipRequest, res: Response): void {
    const formValidation = createAccountService.validateFormFields(req.body);
    const isValidForm = Object.values(formValidation).every(o => o.message === null);
    if (isValidForm) {
      let inputEl: HTMLInputElement = this.inputEl.nativeElement;
      let fileCount: number = inputEl.files.length;
      let formData = new FormData();
      if (fileCount > 0) { // a file was selected
        for (let i = 0; i < fileCount; i++) {
          formData.append('file[]', inputEl.files.item(i));
        }
        this.http
          .post('http://your.upload.url', formData)
        // do whatever you do...
        // subscribe to observable to listen for response
      }
      res.redirect('account-request-submitted');
    } else {
      res.render('create-media-account', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['create-media-account']),
        formErrors: formValidation,
      });
    }
  }
}
