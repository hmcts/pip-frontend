import {PipRequest} from '../models/request/PipRequest';
import {Response} from 'express';
import {cloneDeep} from 'lodash';

export default class SessionExpiredController {
  public get(req: PipRequest, res: Response): void {
    res.render('session-expired', {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['session-expired']),
      signInUrl: req.query.reSignInUrl});
  }
}
