import { dataManagementApi } from './utils/axiosConfig';
import { LogHelper } from '../logging/logHelper';

const logHelper = new LogHelper();

export class CaseEventGlossaryRequests {
    public async getCaseEventGlossaryList(): Promise<Array<any>> {
        try {
            const response = await dataManagementApi.get('/glossary');
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, 'retrieve case event glossary');
        }
        return [];
    }
}
