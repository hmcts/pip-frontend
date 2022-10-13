import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import {cloneDeep} from 'lodash';
import {AccountService} from "../service/accountService";

const accountService = new AccountService();

export default class ThirdPartySearchController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    res.render('third-party-search', {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['third-party-search']),
      thirdPartyAccounts: await accountService.getThirdPartyAccounts()
    });
  }
}
