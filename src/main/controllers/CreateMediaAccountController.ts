import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { CreateAccountService } from '../service/createAccountService';
import { cloneDeep } from 'lodash';

const createAccountService = new CreateAccountService();

export default class CreateMediaAccountController {
  public get(req: PipRequest, res: Response): void {
    res.render('create-media-account', {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['create-media-account']),
    });
  }

  public post(req: PipRequest, res: Response): void {
    console.log('req', req.body);
    console.log('input', createAccountService.validateFormFields(req.body));
    res.render('create-media-account', {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['create-media-account']),
      formErrors: createAccountService.validateFormFields(req.body),
    });
  }
}
