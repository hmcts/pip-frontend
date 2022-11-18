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
   * Method which retrieves a user by their PI User ID.
   *
   * If the user is not a third party role, then this will return null.
   * It also sets the created date of the user to the right format.
   */
  public async getThirdPartyUserById(userId): Promise<any> {
    const account = await accountManagementRequests.getUserById(userId);
    if (account && account.roles.includes('THIRD')) {
      account['createdDate'] = moment.utc(Date.parse(account['createdDate'])).format('DD MMMM YYYY');
      return account;
    }
    return null;
  }

}
