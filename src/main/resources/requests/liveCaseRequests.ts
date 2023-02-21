import { dataManagementApi } from './utils/axiosConfig';

export class LiveCaseRequests {
    public async getLiveCases(locationId: number): Promise<any> {
        try {
            const response = await dataManagementApi.get(`/lcsu/${locationId}`);
            return response.data;
        } catch (error) {
            if (error.response) {
                console.log(error.response.data);
            } else {
                console.log(`ERROR: ${error.message}`);
            }
        }
        return null;
    }
}
