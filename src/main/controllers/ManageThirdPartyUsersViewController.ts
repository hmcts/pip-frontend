import {PipRequest} from '../models/request/PipRequest';
import {Response} from 'express';
import {cloneDeep} from 'lodash';
import {AccountService} from '../service/accountService';
import {SubscriptionService} from '../service/subscriptionService';

const accountService = new AccountService();
const subscriptionsService = new SubscriptionService();

export default class ManageThirdPartyUsersViewController {
  public async get(req: PipRequest, res: Response): Promise<void> {
    if (req.query['userId']) {

      const user = await accountService.getUserById(req.query['userId']);
      const subscriptions = await subscriptionsService.getSubscriptionsByUser(user.userId);

      res.render('manage-third-party-users-view', {
        ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['manage-third-party-users-view']),
        userDetails: user,
        numberOfSubscriptions: subscriptions.listTypeSubscriptions.length,
        subscriptionsChannel: subscriptions.listTypeSubscriptions.length > 0 ? subscriptions.listTypeSubscriptions[0].channel : '',
      });
    } else {
      //Need to do something if userId is not supplied
    }

  }
}
