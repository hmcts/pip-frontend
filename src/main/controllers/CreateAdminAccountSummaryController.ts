import { cloneDeep } from 'lodash';
import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';

export default class CreateAdminAccountSummaryController {
  public get(req: PipRequest, res: Response): void {
    const formData = (req.cookies?.createAdminAccount) ? JSON.parse(req.cookies['createAdminAccount']) : {};
    res.render('create-admin-account-summary', {
      formData,
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['create-admin-account-summary']),
    });
  }

  public async post(req: PipRequest, res: Response): Promise<void> {
    const formData = (req.cookies?.createAdminAccount) ? JSON.parse(req.cookies['createAdminAccount']) : {};
    res.render('create-admin-account-summary', {
      formData,
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['create-admin-account-summary']),
    });
  }
}
