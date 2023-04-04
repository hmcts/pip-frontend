import { accountManagementApi, accountManagementApiUrl, getAccountManagementCredentials } from './utils/axiosConfig';
import { Logger } from '@hmcts/nodejs-logging';
import { MediaAccountApplication } from '../../models/MediaAccountApplication';
import { DateTime } from 'luxon';
import { StatusCodes } from 'http-status-codes';

const superagent = require('superagent');
const logger = Logger.getLogger('requests');

export class AccountManagementRequests {
    /**
     * Request to account management that creates the azure account.
     * @param payload The payload containing the azure accounts to request.
     * @param requester The user ID of the person requesting this.
     */
    public async createAzureAccount(payload, requester): Promise<object | null> {
        try {
            const response = await accountManagementApi.post('/account/add/azure', payload, {
                headers: { 'x-issuer-id': requester },
            });
            logger.info('Azure account created');
            return response.data;
        } catch (error) {
            if (error.response) {
                logger.error('Failed to create azure account on response');
            } else {
                logger.error('Failed to create azure account with message');
            }
            return null;
        }
    }

    /**
     * Request to account management that creates a PI account.
     * @param payload The payload containing the azure accounts to request.
     * @param requester The user ID of the person requesting this.
     */
    public async createPIAccount(payload, requester): Promise<boolean> {
        try {
            const response = await accountManagementApi.post('/account/add/pi', payload, {
                headers: { 'x-issuer-id': requester },
            });
            logger.info('P&I account created');
            return response.status === StatusCodes.CREATED;
        } catch (error) {
            if (error.response) {
                logger.error('Failed to create admin P&I on response');
            } else {
                logger.error('Failed to create admin P&I with message');
            }
            return false;
        }
    }

    public async createMediaAccount(form): Promise<boolean> {
        try {
            const token = await getAccountManagementCredentials();
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
            if (error.response) {
                logger.error('Failed to create media account on response');
            } else {
                logger.error('Failed to create media account with message');
            }
            return false;
        }
    }

    public async bulkCreateMediaAccounts(file, filename, requester): Promise<boolean> {
        try {
            const token = await getAccountManagementCredentials();
            await superagent
                .post(`${accountManagementApiUrl}/account/media-bulk-upload`)
                .set('enctype', 'multipart/form-data')
                .set({ Authorization: 'Bearer ' + token.access_token })
                .set('x-issuer-id', requester)
                .attach('mediaList', file, filename);
            return true;
        } catch (error) {
            if (error.response) {
                logger.error(`Failed to bulk create media account on response. ${error.response.data}`);
            } else {
                logger.error(`Failed to bulk create media account with message. ${error.message}`);
            }
            return false;
        }
    }

    public async getMediaApplicationById(applicationId): Promise<MediaAccountApplication | null> {
        try {
            const response = await accountManagementApi.get('/application/' + applicationId);
            logger.info('Media Application accessed - ' + applicationId);
            return response.data;
        } catch (error) {
            if (error.response) {
                logger.error('Failed to retrieve media application', error.response.data);
            } else {
                logger.error('Failed to retrieve media application', error.message);
            }
            return null;
        }
    }

    public async getMediaApplicationImageById(imageId): Promise<Blob> {
        try {
            const response = await accountManagementApi.get('/application/image/' + imageId, {
                responseType: 'arraybuffer',
            });
            logger.info('Media Application image access with ID - ' + imageId);
            return response.data;
        } catch (error) {
            if (error.response) {
                logger.error('Failed to retrieve media application image - response', error.response.data);
            } else {
                logger.error('Failed to retrieve media application image - message', error.message);
            }
        }
        return null;
    }

    public async updateMediaApplicationStatus(
        applicantId,
        status,
        reasons = null
    ): Promise<MediaAccountApplication | null> {
        try {
            let response;
            if (reasons) {
                response = await accountManagementApi.put(
                    '/application/' + applicantId + '/' + status + '/reasons',
                    reasons
                );
                logger.info('Media Application updated and attempted email send - ' + applicantId);
            } else {
                response = await accountManagementApi.put('/application/' + applicantId + '/' + status);
                logger.info('Media Application updated - ' + applicantId);
            }
            return response.data;
        } catch (error) {
            if (error.response) {
                logger.error('Failed to update media application', error.response.data);
            } else {
                logger.error('Failed to update media application', error.message);
            }
        }
        return null;
    }

    public async getPendingMediaApplications(): Promise<MediaAccountApplication[]> {
        try {
            const response = await accountManagementApi.get('/application/status/PENDING');
            return response.data;
        } catch (error) {
            if (error.response) {
                logger.error('Failed to GET media application requests', error.response.data);
            } else {
                logger.error('Something went wrong trying to get media applications', error.message);
            }
            return [];
        }
    }

    public async getPiUserByAzureOid(oid: string): Promise<any> {
        try {
            const response = await accountManagementApi.get(`/account/provenance/PI_AAD/${oid}`);
            return response.data;
        } catch (error) {
            if (error.response) {
                logger.error('Failed to GET PI user request', error.response.data);
            } else {
                logger.error('Something went wrong trying to get the pi user from the oid', error.message);
            }
            return null;
        }
    }

    public async getPiUserByCftID(uid: string): Promise<any> {
        try {
            const response = await accountManagementApi.get(`/account/provenance/CFT_IDAM/${uid}`);
            return response.data;
        } catch (error) {
            if (error.response) {
                error.response.status === StatusCodes.NOT_FOUND
                    ? logger.info(`Could not find CFT IDAM user with provenance user ID: ${uid}`)
                    : logger.error('Failed to GET PI user request', error.response.data);
            } else {
                logger.error('Something went wrong trying to get the pi user from the uid', error.message);
            }
            return null;
        }
    }

    public async getThirdPartyAccounts(adminUserId): Promise<any> {
        try {
            logger.info('Third party account data requested by Admin with ID: ' + adminUserId);
            const response = await accountManagementApi.get('/account/all/third-party');
            return response.data;
        } catch (error) {
            if (error.response) {
                logger.error('Failed to GET third party users', error.response.data);
            } else {
                logger.error('Something went wrong trying to get third party users', error.message);
            }
            return null;
        }
    }

    public async updateMediaAccountVerification(oid: string): Promise<string> {
        return this.updateAccountDate('PI_AAD', oid, 'lastVerifiedDate', 'Failed to verify media account');
    }

    public async updateAccountLastSignedInDate(userProvenance: string, oid: string): Promise<string> {
        return this.updateAccountDate(
            userProvenance,
            oid,
            'lastSignedInDate',
            'Failed to update account last signed in date'
        );
    }

    private async updateAccountDate(
        userProvenance: string,
        oid: string,
        field: string,
        errorMessage: string
    ): Promise<string> {
        try {
            const map = {};
            map[field] = DateTime.now().toISO();
            const response = await accountManagementApi.put(`/account/provenance/${userProvenance}/${oid}`, map);
            return response.data;
        } catch (error) {
            if (error.response) {
                logger.error(errorMessage, error.response.data);
            } else {
                logger.error(errorMessage, error.message);
            }
            return null;
        }
    }

    public async getAllAccountsExceptThirdParty(params: object, adminUserId: string): Promise<any> {
        try {
            logger.info('All user data requested by Admin with ID: ' + adminUserId);
            const response = await accountManagementApi.get('/account/all', params);
            return response.data;
        } catch (error) {
            if (error.response) {
                logger.error('Failed to get all accounts', error.response.data);
            } else {
                logger.error('Something went wrong trying to get all accounts', error.message);
            }
            return [];
        }
    }

    public async getUserByUserId(userId: string, adminUserId: string): Promise<any> {
        try {
            logger.info('User with ID: ' + userId + ' data requested by Admin with ID: ' + adminUserId);
            const response = await accountManagementApi.get(`/account/${userId}`);
            return response.data;
        } catch (error) {
            if (error.response) {
                logger.error('Failed to GET PI user request', error.response.data);
            } else {
                logger.error('Something went wrong trying to get the pi user from the user id', error.message);
            }
            return null;
        }
    }

    public async deleteUser(userId: string, adminUserId: string): Promise<object> {
        try {
            logger.info('User with ID: ' + userId + ' deleted by Admin with ID: ' + adminUserId);
            const response = await accountManagementApi.delete(`/account/delete/${userId}`);
            return response.data;
        } catch (error) {
            if (error.response) {
                console.log(error.response.data);
            } else {
                console.log(`ERROR: ${error.message}`);
            }
            return null;
        }
    }

    public async updateUser(userId: string, role: string, adminUserId: string): Promise<object | string> {
        try {
            logger.info(
                'User with ID: ' +
                    userId +
                    ' role attempting to be updated to ' +
                    role +
                    ' by Admin with ID: ' +
                    adminUserId
            );
            const response = await accountManagementApi.put(`/account/update/${userId}/${role}`, null, {
                headers: {
                    'x-admin-id': adminUserId,
                },
            });
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 403) {
                logger.info('Admin user with ID: ' + adminUserId + ' has failed to update user with role');
                return 'FORBIDDEN';
            } else if (error.response) {
                logger.info(error.response.data);
            } else {
                logger.info(`ERROR: ${error.message}`);
            }
            return null;
        }
    }

    public async getAdminUserByEmailAndProvenance(
        email: string,
        provenance: string,
        adminUserId: string
    ): Promise<any> {
        try {
            logger.info('Admin with ID: ' + adminUserId + 'requested user by email.');
            const response = await accountManagementApi.get(`/account/admin/${email}/${provenance}`);
            return response.data;
        } catch (error) {
            if (error.response) {
                logger.error('Failed to GET PI user request', error.response.data);
            } else {
                logger.error('Something went wrong trying to get the pi user from the user id', error.message);
            }
            return null;
        }
    }

    /**
     * Request method that attempts to create a system admin account.
     * @param systemAdminAccount The System Admin account to create.
     * @param adminUserId The System Admin who is creating the account.
     */
    public async createSystemAdminUser(systemAdminAccount, adminUserId: string): Promise<object> {
        try {
            logger.info('A system admin user is being created with ID: ' + adminUserId);
            const response = await accountManagementApi.post('/account/add/system-admin', systemAdminAccount, {
                headers: { 'x-issuer-id': adminUserId },
            });
            return response.data;
        } catch (error) {
            if (error.response) {
                if (error.response.status == StatusCodes.BAD_REQUEST) {
                    error.response.data['error'] = true;
                    return error.response.data;
                } else {
                    console.log(
                        'Request to create a system admin has failed with error code: ' + error.response.status
                    );
                }
            } else {
                console.log(`ERROR: ${error.message}`);
            }
            return null;
        }
    }

    public async storeAuditAction(auditBody): Promise<any> {
        try {
            const response = await accountManagementApi.post('/audit', auditBody);
            return response.data;
        } catch (error) {
            if (error.response) {
                logger.error('Failed to post audit action', error.response.data);
            } else {
                logger.error('Something went wrong trying to post an audit action', error.message);
            }
            return null;
        }
    }

    public async getAllAuditLogs(params: object, adminUserId: string): Promise<any> {
        try {
            logger.info('All audit log data requested by Admin with ID: ' + adminUserId);
            const response = await accountManagementApi.get('/audit', params);
            return response.data;
        } catch (error) {
            if (error.response) {
                logger.error('Failed to get all audit logs', error.response.data);
            } else {
                logger.error('Something went wrong trying to get all audit logs', error.message);
            }
            return [];
        }
    }

    public async getAuditLogById(id: string): Promise<any> {
        try {
            const response = await accountManagementApi.get(`/audit/${id}`);
            return response.data;
        } catch (error) {
            if (error.response) {
                logger.error(`Failed to get audit log with id: ${id}`, error.response.data);
            } else {
                logger.error(`Something went wrong trying to get audit log with id: ${id}`, error.message);
            }
            return null;
        }
    }
}
