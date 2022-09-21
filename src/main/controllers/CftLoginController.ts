import {PipRequest} from '../models/request/PipRequest';
import {Response} from 'express';
import {CFT_IDAM_URL, FRONTEND_URL} from '../helpers/envUrls';

export default class CftLoginController {

  public async get(req: PipRequest, res: Response): Promise<void> {
    res.redirect(CFT_IDAM_URL + '?client_id=app-pip-frontend&response_type=code&redirect_uri=' + encodeURI(FRONTEND_URL + '/cft-login/return'));
  }
}
