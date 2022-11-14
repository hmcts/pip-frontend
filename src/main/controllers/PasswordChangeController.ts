import { Response } from 'express';
import { PipRequest } from '../models/request/PipRequest';
import { cloneDeep } from 'lodash';

export default class PasswordChangeController {
  public get(req: PipRequest, res: Response): void {
    const splitUrl = req.path.split('/')[2];
    let isAdmin = false;
    if (splitUrl === 'true') {
      isAdmin = true;
    }
    res.render('password-change-confirmation', {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['password-change-confirmation']),
      isAdmin: isAdmin,
    });
  }
}
