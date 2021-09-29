import {PipApi} from '../../utils/PipApi';

export class SearchDescriptionActions {
  constructor(private readonly api: PipApi) {}

  public async getStatusDescriptionList(): Promise<any> {

    const statusDescriptionData = await this.api.getStatusDescriptionList();

    if (statusDescriptionData) {
      return statusDescriptionData;
    } else {
      console.error('unable to get court status description list');
      return [];
    }
  }
}
