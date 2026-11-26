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

    public async getUserCommunicationById(userCommunicationId: string, requester: string): Promise<UserCommunication> {
        try {
            const response = await accountManagementApi.get(`/communication/${userCommunicationId}`, {
                headers: { 'x-requester-id': requester },
            });
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, `retrieve user communication with ID ${userCommunicationId}`);
        }
        return null;
    }

    public async updateUserCommunication(
        payload: any,
        userCommunicationId: string,
        requester: string
    ): Promise<boolean> {
        try {
            await accountManagementApi.put(`/communication/${userCommunicationId}`, payload, {
                headers: { 'x-requester-id': requester },
            });
            return true;
        } catch (error) {
            logHelper.logErrorResponse(error, `update user communication with ID ${userCommunicationId}`);
        }
        return false;
    }

    public async deleteUserCommunication(userCommunicationId: string, requester: string): Promise<boolean> {
        try {
            await accountManagementApi.delete(`/communication/${userCommunicationId}`, {
                headers: { 'x-requester-id': requester },
            });
            return true;
        } catch (error) {
            logHelper.logErrorResponse(error, `delete user communication with ID ${userCommunicationId}`);
        }
        return false;
    }
}
