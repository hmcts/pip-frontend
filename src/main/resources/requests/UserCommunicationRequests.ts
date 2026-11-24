import { UserCommunication } from '../../models/UserCommunication';
import { accountManagementApi } from './utils/axiosConfig';
import { LogHelper } from '../logging/logHelper';
import { StatusCodes } from 'http-status-codes';

const logHelper = new LogHelper();

export class UserCommunicationRequests {
    public async createUserCommunication(payload: any, requester): Promise<boolean> {
        try {
            const response = await accountManagementApi.post('/communication', payload, {
                headers: { 'x-requester-id': requester },
            });
            return response.status === StatusCodes.CREATED;
        } catch (error) {
            logHelper.logErrorResponse(error, 'create user communication');
        }
        return false;
    }

    public async getAllUserCommunications(): Promise<Array<UserCommunication>> {
        try {
            const response = await accountManagementApi.get('/communication');
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, 'retrieve all user communications');
        }
        return [];
    }

    public async getUserCommunication(userId: string): Promise<UserCommunication> {
        try {
            const response = await accountManagementApi.get(`/communication/${userId}`);
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, `retrieve user communication with ID ${userId}`);
        }
        return null;
    }

    public async updateUserCommunication(userId: string, payload: any): Promise<boolean> {
        try {
            await accountManagementApi.put(`/communication/${userId}`, payload);
            return true;
        } catch (error) {
            logHelper.logErrorResponse(error, `update user communication with ID ${userId}`);
        }
        return false;
    }

    public async deleteUserCommunication(userId: string): Promise<object> {
        try {
            const response = await accountManagementApi.delete(`/communication/${userId}`);
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, `delete user communication with ID ${userId}`);
        }
        return null;
    }
}
