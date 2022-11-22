import { Response } from 'express';
import { PipRequest } from '../models/request/PipRequest';
import {cloneDeep} from 'lodash';

export default class PasswordChangeController {
  public get(req: PipRequest, res: Response): void {
    res.render('cancelled-password-reset', {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['cancelled-password-reset']),
      isAdmin: req.params['isAdmin'] === 'true',
    });
  }
}
