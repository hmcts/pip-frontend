import { Response } from 'express';
import {PipRequest} from '../models/request/PipRequest';
import {cloneDeep} from 'lodash';

export default class IdamSigninController {

  public get(req: PipRequest, res: Response): void {
    res.render('idam-signin', {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['idam-signin']),
    });
  }

  public post(req: PipRequest, res: Response): void {
    const selectChoice = req.body['idam-select'];
    if (selectChoice === 'crime') {
      res.redirect('https://www.google.com');
    } else if (selectChoice === 'cft') {
      res.redirect('https://www.google.com');
    } else {
      res.render('idam-signin', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['idam-signin']),
      });
    }
  }
}
