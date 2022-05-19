import { AccountManagementRequests } from '../resources/requests/accountManagementRequests';
import {Artefact} from '../models/Artefact';

const accountManagementRequests = new AccountManagementRequests();

export class UserService {
  public async isAuthorisedToViewList(userId: string, listType: string): Promise<boolean> {
    return await accountManagementRequests.isAuthorisedToViewList(userId, listType);
  }

  public async getUserInfo(userProvenance: string, provenanceUserId: string): Promise<object> {
    return await accountManagementRequests.getUserInfo(userProvenance, provenanceUserId);
  }

  public async isAuthorisedToViewListByAzureUserId(user: object, listType: string): Promise<boolean> {
    let pandiUserId = null;

    if(user) {
      const response = await this.getUserInfo('PI_AAD', user['oid']);
      if(response) {
        pandiUserId = response['userId'];
      }
    }

    return await this.isAuthorisedToViewList(pandiUserId, listType);
  }

  public async getAuthorisedPublications(publications: Artefact[], user: object): Promise<Artefact[]> {
    const uniqueListTypes = [...new Set(publications.map(item => item.listType))];

    for (const listType of uniqueListTypes) {
      const isAllowed = await this.isAuthorisedToViewListByAzureUserId(user, listType);
      if(!isAllowed) {
        publications = this.excludeNotAllowedPublications(publications, listType);
      }
    }

    return publications;
  }

  private excludeNotAllowedPublications(publications: Artefact[], listType: string): Artefact[]{
    publications = publications.filter(function( artefact ) {
      return artefact.listType !== listType;
    });
    return publications;
  }
}
