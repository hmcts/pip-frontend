import { AccountManagementRequests } from '../resources/requests/accountManagementRequests';

const accountManagementRequests = new AccountManagementRequests();

export class UserService {

  public async getUserInfo(userProvenance: string, userId: string): Promise<object> {
    return await accountManagementRequests.getUserInfo(userProvenance, userId);
  }

  public async getPandIUserId(userProvenance: string, user: object): Promise<string> {
    let pandiUserId = null;

    if(user) {
      const response = await this.getUserInfo(userProvenance, user['oid']);
      if(response) {
        pandiUserId = response['userId'];
      }
    }

    return pandiUserId;
  }
}
