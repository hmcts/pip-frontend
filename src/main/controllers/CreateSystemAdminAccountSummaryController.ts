import { cloneDeep } from 'lodash';
import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { CreateAccountService } from '../service/createAccountService';

const createAccountService = new CreateAccountService();

export default class CreateSystemAdminAccountSummaryController {
  public get(req: PipRequest, res: Response): void {
    const formData = (req.cookies?.createAdminAccount) ? JSON.parse(req.cookies['createAdminAccount']) : {};
    res.render('create-system-admin-account-summary', {
      formData,
      accountCreated: false,
      displayError: false,
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['create-system-admin-account-summary']),
    });
  }

  public async post(req: PipRequest, res: Response): Promise<void> {
    const formData = (req.cookies?.createAdminAccount) ? JSON.parse(req.cookies['createAdminAccount']) : {};

    formData['userRoleObject'] = {mapping: 'SYSTEM_ADMIN'};

    const response = await createAccountService.createAdminAccount(formData, req.user?.['userId']);
    if (response) {
      res.cookie('createAdminAccount', '');
    }

    res.render('create-system-admin-account-summary', {
      formData,
      accountCreated: response,
      displayError: !response,
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['create-system-admin-account-summary']),
    });

  }
}
