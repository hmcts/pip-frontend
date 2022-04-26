import { cloneDeep } from 'lodash';
import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { CreateAccountService } from '../service/createAccountService';

const createAccountService = new CreateAccountService();

export default class CreateAdminAccountSummaryController {
  public get(req: PipRequest, res: Response): void {
    const formData = (req.cookies?.createAdminAccount) ? JSON.parse(req.cookies['createAdminAccount']) : {};
    res.render('create-admin-account-summary', {
      formData,
      accountCreated: false,
      displayError: false,
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['create-admin-account-summary']),
    });
  }

  public async post(req: PipRequest, res: Response): Promise<void> {
    const formData = (req.cookies?.createAdminAccount) ? JSON.parse(req.cookies['createAdminAccount']) : {};
    const response = await createAccountService.createAdminAccount(formData, req.user?.['emails'][0]);
    response ?
      res.render('create-admin-account-summary', {
        formData,
        accountCreated: true,
        displayError: false,
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['create-admin-account-summary']),
      }) :
      res.render('create-admin-account-summary', {
        formData,
        accountCreated: false,
        displayError: true,
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['create-admin-account-summary']),
      });
  }
}
