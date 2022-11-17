import {AccountManagementRequests} from '../resources/requests/accountManagementRequests';
import moment from 'moment';

const accountManagementRequests = new AccountManagementRequests();

/**
 * Service class to handle general account requests.
 */
export class AccountService {

  /**
   * Service which gets third party accounts from the backend.
   */
  public async getThirdPartyAccounts(): Promise<any> {
    const returnedAccounts = await accountManagementRequests.getThirdPartyAccounts();
    for (const account of returnedAccounts) {
      account['createdDate'] = moment.utc(Date.parse(account['createdDate'])).format('DD MMMM YYYY');
    }
    return returnedAccounts;
  }

  /**
   * Method which retrieves a user by their pi user ID
   */
  public async getUserById(userId): Promise<any> {
    const account = await accountManagementRequests.getUserById(userId);
    account['createdDate'] = moment.utc(Date.parse(account['createdDate'])).format('DD MMMM YYYY');
    return account;
  }

}
