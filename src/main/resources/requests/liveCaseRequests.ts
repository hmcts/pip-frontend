import { dataManagementApi } from './utils/axiosConfig';
import { LogHelper } from '../logging/logHelper';

const logHelper = new LogHelper();

export class LiveCaseRequests {
    public async getLiveCases(locationId: number): Promise<any> {
        try {
            const response = await dataManagementApi.get(`/lcsu/${locationId}`);
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, 'retrieve live cases');
        }
        return null;
    }
}
