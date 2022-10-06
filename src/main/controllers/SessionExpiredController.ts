import {PipRequest} from '../models/request/PipRequest';
import {Response} from 'express';
import {cloneDeep} from 'lodash';

const authenticationConfig = require('../authentication/authentication-config.json');

export default class SessionExpiredController {
  public get(req: PipRequest, res: Response): void {
    const signInUrl = (req.query.admin === "true")
      ? `/admin-login?p=${authenticationConfig.ADMIN_POLICY}`
      : `/login?p=${authenticationConfig.POLICY}`;

    res.render('session-expired', {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['session-expired']),
      signInUrl: signInUrl});
  }
}
