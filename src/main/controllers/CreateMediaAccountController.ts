import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { CreateAccountService } from '../service/createAccountService';
import { cloneDeep } from 'lodash';

const createAccountService = new CreateAccountService();

export default class CreateMediaAccountController {
  public get(req: PipRequest, res: Response): void {
    res.render('create-media-account', req.i18n.getDataByLanguage(req.lng)['create-media-account']);
  }

  public async post(req: PipRequest, res: Response): Promise<void> {
    const formValidation = createAccountService.validateFormFields(req.body);
    const isValidForm = Object.values(formValidation).every(o => o.message === null);

    if (isValidForm) {
      const response = await createAccountService.createMediaAccount(req.body);

      if (response) {
        res.redirect('account-request-submitted');
      } else {
        res.render('create-media-account');
      }
    } else {
      res.render('create-media-account', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['create-media-account']),
        formErrors: formValidation,
      });
    }
  }
}
