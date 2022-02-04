import { dataManagementApi } from './utils/axiosConfig';

export class DailyCauseListRequests {
  public async getDailyCauseList(artefactId: string): Promise<any> {
    try {
      const config = {
        headers: {
          verification: 'true',
        },
      };
      const response = await dataManagementApi.get('/publication/' + artefactId + '/payload', config);
      return response.data;
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
      } else if (error.request) {
        console.log(`Request failed. ${error.request}`);
      } else {
        console.log(`ERROR: ${error.message}`);
      }
    }
    return null;
  }

  public async getDailyCauseListMetaData(artefactId: string): Promise<any> {
    try {
      const config = {
        headers: {
          verification: 'true',
        },
      };
      const response = await dataManagementApi.get('/publication/' + artefactId, config);
      return response.data;
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
      } else if (error.request) {
        console.log(`Request failed. ${error.request}`);
      } else {
        console.log(`ERROR: ${error.message}`);
      }
    }
    return null;
  }
}
