import { accountManagementApi, accountManagementApiUrl, getAccountManagementCredentials } from './utils/axiosConfig';
import { Logger } from '@hmcts/nodejs-logging';
import { MediaAccountApplication } from '../../models/MediaAccountApplication';
import { DateTime } from 'luxon';
import { StatusCodes } from 'http-status-codes';
import { LogHelper } from '../logging/logHelper';
import superagent from 'superagent';

const logger = Logger.getLogger('requests');
const logHelper = new LogHelper();

export class AccountManagementRequests {
    /**
     * Request to account management that creates the azure account.
     * @param payload The payload containing the azure accounts to request.
     * @param requester The user ID of the person requesting this.
     */
    public async createAzureAccount(payload, requester): Promise<object | null> {
        try {
            const response = await accountManagementApi.post('/account/add/azure', payload, {
                headers: { 'x-requester-id': requester , 'x-issuer-id': requester },
            });
            logger.info('Azure account created');
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, 'create azure account');
        }
        return null;
    }

    /**
     * Request to account management that creates a PI account.
     * @param payload The payload containing the azure accounts to request.
     * @param requester The user ID of the person requesting this.
     */
    public async createPIAccount(payload, requester): Promise<object | null> {
        try {
            const response = await accountManagementApi.post('/account/add/pi', payload, {
                headers: { 'x-requester-id': requester, 'x-issuer-id': requester },
            });
            logger.info('P&I account created');
            return response.status === StatusCodes.CREATED ? response.data : null;
        } catch (error) {
            logHelper.logErrorResponse(error, 'create P&I user account');
        }
        return null;
    }

    public async createMediaApplication(form): Promise<boolean> {
        try {
            const token = await getAccountManagementCredentials('');
            await superagent
                .post(`${accountManagementApiUrl}/application`)
                .set('enctype', 'multipart/form-data')
                .set({ Authorization: 'Bearer ' + token.access_token })
                .attach('file', form.file.body, form.file.name)
                .field('fullName', form.fullName)
                .field('email', form.email)
                .field('employer', form.employer)
                .field('status', form.status);
            return true;
        } catch (error) {
            logHelper.logErrorResponse(error, 'create media application');
        }
        return false;
    }

    public async bulkCreateMediaAccounts(file, filename, requester): Promise<boolean> {
        try {
            const token = await getAccountManagementCredentials('');
            await superagent
                .post(`${accountManagementApiUrl}/account/media-bulk-upload`)
                .set('enctype', 'multipart/form-data')
                .set({ Authorization: 'Bearer ' + token.access_token })
                .set({ 'x-requester-id': requester,  'x-issuer-id': requester})
                .attach('mediaList', file, filename);
            return true;
        } catch (error) {
            logHelper.logErrorResponse(error, 'bulk create media accounts');
        }
        return false;
    }

    public async getMediaApplicationById(applicationId, adminUserId): Promise<MediaAccountApplication | null> {
        try {
            const response = await accountManagementApi.get('/application/' + applicationId, {
                headers: {
                    'x-requester-id': adminUserId,
                },
            });
            logger.info('Media Application with ID: ' + applicationId + ' requested by Admin with ID: ' + adminUserId);
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, `retrieve media application with ID ${applicationId}`);
        }
        return null;
    }

    public async getMediaApplicationImageById(imageId, adminUserId): Promise<Blob> {
        try {
            const response = await accountManagementApi.get('/application/image/' + imageId, {
                responseType: 'arraybuffer',
                headers: {
                    'x-requester-id': adminUserId,
                },
            });
            logger.info(
                'Media Application image access with ID: ' + imageId + ' requested by Admin with ID: ' + adminUserId
            );
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, `retrieve media application image with ID ${imageId}`);
        }
        return null;
    }

    public async updateMediaApplicationStatus(
        applicantId,
        status,
        adminUserId,
        reasons = null
    ): Promise<MediaAccountApplication | null> {
        try {
            let response;
            const headers = adminUserId ? { 'x-requester-id': adminUserId } : {};
            if (reasons) {
                response = await accountManagementApi.put(
                    '/application/' + applicantId + '/' + status + '/reasons',
                    reasons,
                    { headers }
                );
                logger.info(
                    'Media Application updated and attempted email send: ' +
                        applicantId +
                        ' by Admin with ID: ' +
                        adminUserId
                );
            } else {
                response = await accountManagementApi.put('/application/' + applicantId + '/' + status, { headers });
                logger.info('Media Application updated: ' + applicantId + ' by Admin with ID: ' + adminUserId);
            }
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, `update status of media application with ID ${applicantId}`);
        }
        return null;
    }

    public async getPendingMediaApplications(adminUserId): Promise<MediaAccountApplication[]> {
        try {
            logger.info('All pending media applications requested by Admin with ID: ' + adminUserId);
            const response = await accountManagementApi.get('/application/status/PENDING', {
                headers: {
                    'x-requester-id': adminUserId,
                },
            });
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, 'retrieve pending media applications');
        }
        return [];
    }

    public async getPiUserByAzureOid(oid: string, userProvenance = 'PI_AAD'): Promise<any> {
        try {
            const response = await accountManagementApi.get(`/account/provenance/${userProvenance}/${oid}`);
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, 'retrieve P&I user account by Azure object ID');
        }
        return null;
    }

    public async getPiUserByCftID(uid: string): Promise<any> {
        try {
            const response = await accountManagementApi.get(`/account/provenance/CFT_IDAM/${uid}`);
            return response.data;
        } catch (error) {
            if (error.response?.status === StatusCodes.NOT_FOUND) {
                logger.info(`Could not find CFT IDAM user with provenance user ID: ${uid}`);
            } else {
                logHelper.logErrorResponse(error, 'retrieve P&I user account by CFT IDAM ID');
            }
        }
        return null;
    }

    public async getThirdPartyAccounts(adminUserId): Promise<any> {
        try {
            logger.info('Third party account data requested by Admin with ID: ' + adminUserId);
            const response = await accountManagementApi.get('/account/all/third-party', {
                headers: {
                    'x-requester-id': adminUserId,
                },
            });
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, 'retrieve third party accounts');
        }
        return null;
    }

    public async updateMediaAccountVerification(oid: string): Promise<string> {
        return this.updateAccountDate('PI_AAD', oid, 'lastVerifiedDate', 'verify media account');
    }

    public async updateAccountLastSignedInDate(userProvenance: string, oid: string): Promise<string> {
        return this.updateAccountDate(userProvenance, oid, 'lastSignedInDate', 'update account last signed in date');
    }

    private async updateAccountDate(
        userProvenance: string,
        oid: string,
        field: string,
        requestAction: string
    ): Promise<string> {
        try {
            const map = {};
            map[field] = DateTime.now().toISO();
            const response = await accountManagementApi.put(`/account/provenance/${userProvenance}/${oid}`, map);
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, requestAction);
        }
        return null;
    }

    public async getAllAccountsExceptThirdParty(params: object, adminUserId: string): Promise<any> {
        try {
            logger.info('All user data requested by Admin with ID: ' + adminUserId);
            const response = await accountManagementApi.get('/account/all', {
                ...params,
                headers: {
                    'x-requester-id': adminUserId,
                },
            });
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, 'retrieve all accounts');
        }
        return [];
    }

    public async getUserByUserId(userId: string, adminUserId: string): Promise<any> {
        try {
            logger.info(`User with ID: ${userId} data requested by Admin with ID: ${adminUserId}`);
            const response = await accountManagementApi.get(`/account/${userId}`, {
                headers: {
                    'x-requester-id': adminUserId,
                },
            });
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, `retrieve account for user with ID ${userId}`);
        }
        return null;
    }

    public async deleteUser(userId: string, adminUserId): Promise<object> {
        try {
            logger.info('User with ID: ' + userId + ' deleted by Admin with ID: ' + adminUserId);
            const headers = adminUserId ? { 'x-requester-id': adminUserId, 'x-admin-id': adminUserId } : {};
            const response = await accountManagementApi.delete(`/account/v2/${userId}`, {
                headers: headers,
            });
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, `delete account for user with ID ${userId}`);
        }
        return null;
    }

    public async updateUser(userId: string, role: string, adminUserId): Promise<object | string> {
        try {
            logger.info(
                'User with ID: ' +
                    userId +
                    ' role attempting to be updated to ' +
                    role +
                    ' by Admin with ID: ' +
                    adminUserId
            );
            const headers = adminUserId ? { 'x-requester-id': adminUserId, 'x-admin-id': adminUserId } : {};
            const response = await accountManagementApi.put(`/account/update/${userId}/${role}`, null, {
                headers: headers,
            });
            return response.data;
        } catch (error) {
            if (error.response?.status === StatusCodes.FORBIDDEN) {
                logger.info(`Admin user with ID: ${adminUserId}' has failed to update user with role`);
                return 'FORBIDDEN';
            } else {
                logHelper.logErrorResponse(error, `update account for user with ID ${userId}`);
            }
        }
        return null;
    }

    /**
     * Request method that attempts to create an SSO system admin account.
     * @param systemAdminAccount The System Admin account to create.
     */
    public async createSystemAdminUser(systemAdminAccount): Promise<object> {
        try {
            const response = await accountManagementApi.post('/account/system-admin', systemAdminAccount);
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, 'create system admin account');
            if (error.response?.status === StatusCodes.BAD_REQUEST) {
                error.response.data['error'] = true;
                return error.response.data;
            }
        }
        return null;
    }

    public async storeAuditAction(auditBody): Promise<any> {
        try {
            const response = await accountManagementApi.post('/audit', auditBody);
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, 'post audit action');
        }
        return null;
    }

    public async getAllAuditLogs(params: object, adminUserId: string): Promise<any> {
        try {
            logger.info('All audit log data requested by Admin with ID: ' + adminUserId);
            const response = await accountManagementApi.get('/audit', {
                ...params,
                headers: { 'x-requester-id': adminUserId },
            });
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, 'retrieve all audit logs');
        }
        return [];
    }

    public async getAuditLogById(id: string, adminUserId: string): Promise<any> {
        try {
            logger.info('Audit log with ID: ' + id + ' requested by Admin with ID: ' + adminUserId);
            const response = await accountManagementApi.get(`/audit/${id}`, {
                headers: { 'x-requester-id': adminUserId },
            });
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, `retrieve audit log by ID ${id}`);
        }
        return null;
    }

    public async isAuthorised(userId: string, listType: string, sensitivity: string): Promise<boolean> {
        try {
            const response = await accountManagementApi.get(
                `/account/isAuthorised/${userId}/${listType}/${sensitivity}`
            );
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, `check user ${userId} is authorised`);
        }
        return false;
    }
}
