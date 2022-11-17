import {PipRequest} from '../models/request/PipRequest';
import {Response} from 'express';
import {cloneDeep} from 'lodash';
import {AccountService} from '../service/accountService';

const accountService = new AccountService();

export default class ManageThirdPartyUsersController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    res.render('manage-third-party-users', {
      ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['manage-third-party-users']),
      thirdPartyAccounts: await accountService.getThirdPartyAccounts(),
    });
  }
}
