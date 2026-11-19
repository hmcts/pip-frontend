import { UserCommunication } from '../../models/UserCommunication';
import { accountManagementApi } from './utils/axiosConfig';
import { LogHelper } from '../logging/logHelper';

const logHelper = new LogHelper();

export class UserCommunicationRequests {
    public async getAllUserCommunications(): Promise<Array<UserCommunication>> {
        try {
            const response = await accountManagementApi.get('/communication');
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, 'retrieve all user communications');
        }
        return [];
    }
}
