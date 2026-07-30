import { dataManagementApi } from './utils/axiosConfig';
import { Artefact } from '../../models/Artefact';
import { HttpStatusCode } from 'axios';
import { LogHelper } from '../logging/logHelper';
import { CaseSearchResults } from 'models/CaseSearchResults';

const logHelper = new LogHelper();

export class PublicationRequests {
    public async getIndividualPublicationMetadata(artefactId, requesterId, admin): Promise<any> {
        try {
            let header;
            if (requesterId) {
                header = { headers: { 'x-requester-id': requesterId, 'x-admin': admin } };
            } else {
                header = { headers: { 'x-admin': admin } };
            }

            const response = await dataManagementApi.get(`/publication/${artefactId}`, header);
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, `retrieve metadata for publication with ID ${artefactId}`);
            return error.response?.status === 404 ? HttpStatusCode.NotFound : null;
        }
    }

    public async getPubsPerLocation(requesterId: string): Promise<any> {
        try {
            const header = { headers: { 'x-requester-id': requesterId } };
            const response = await dataManagementApi.get('/publication/count-by-location', header);
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, 'retrieve publication count for all locations');
        }
        return null;
    }

    public async getCasesByCaseNumber(searchValue: string, userId: string): Promise<CaseSearchResults[]> {
        try {
            const response = await dataManagementApi.get('/publication/search/caseNumber', {
                params: {
                    searchValue: searchValue,
                },
                headers: {
                    'x-requester-id': userId,
                },
            });
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, 'retrieve cases by case number');
        }
        return [];
    }

    public async getCasesByCaseName(
        searchValue: string,
        userId: string,
        fuzzySearch = false
    ): Promise<CaseSearchResults[]> {
        try {
            const response = await dataManagementApi.get('/publication/search/caseName', {
                params: {
                    searchValue: searchValue,
                    fuzzySearch: fuzzySearch,
                },
                headers: {
                    'x-requester-id': userId,
                },
            });
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, 'retrieve cases by case name');
        }
        return [];
    }

    public async getIndividualPublicationJson(artefactId, userId): Promise<number> {
        try {
            let header;
            if (userId) {
                header = { headers: { 'x-requester-id': userId } };
            }

            const response = await dataManagementApi.get('/publication/' + artefactId + '/payload', header);
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, `retrieve JSON publication with ID ${artefactId}`);
            return error.response?.status === 404 ? HttpStatusCode.NotFound : null;
        }
    }

    public async getIndividualPublicationFile(artefactId, userId): Promise<Blob | number> {
        try {
            let header;
            if (userId) {
                header = {
                    headers: { 'x-requester-id': userId },
                    responseType: 'arraybuffer',
                };
            } else {
                header = { responseType: 'arraybuffer' };
            }
            const response = await dataManagementApi.get(`/publication/${artefactId}/file`, header);
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, `retrieve flat file publication with ID ${artefactId}`);
            return error.response?.status === 404 ? HttpStatusCode.NotFound : null;
        }
    }

    public async getPublicationsByLocation(locationId: string, userId: string, admin: boolean): Promise<Artefact[]> {
        try {
            let header;
            if (userId) {
                header = { headers: { 'x-requester-id': userId, 'x-admin': admin } };
            } else {
                header = { headers: { 'x-admin': admin } };
            }

            const response = await dataManagementApi.get(`/publication/locationId/${locationId}`, header);
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, `retrieve publications for location with ID ${locationId}`);
        }
        return [];
    }

    public async archivePublication(artefactId: string, id: string): Promise<boolean> {
        try {
            await dataManagementApi.put(
                `/publication/${artefactId}/archive`,
                {},
                { headers: { 'x-requester-id': id } }
            );
            return true;
        } catch (error) {
            logHelper.logErrorResponse(error, `archive publication with ID ${artefactId}`);
        }
        return false;
    }

    public async deleteLocationPublication(locationId: number, userId: string): Promise<object> {
        try {
            const header = { headers: { 'x-requester-id': userId } };
            const response = await dataManagementApi.delete(`/publication/${locationId}/deleteArtefacts`, header);
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, `delete publications for location with ID ${locationId}`);
        }
        return null;
    }

    public async getNoMatchPublications(userId: string): Promise<Artefact[]> {
        try {
            const header = { headers: { 'x-requester-id': userId } };
            const response = await dataManagementApi.get(`/publication/no-match`, header);
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, 'retrieve no-match publications');
        }
        return [];
    }

    public async getMiPublicationData(days: number | null): Promise<object> {
        try {
            const normalizedDays = days ? Number(days) : undefined;

            const params = normalizedDays == null ? {} : { days: normalizedDays };
            const response = await dataManagementApi.get('/publication/mi-data', { params: params });
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, 'retrieve mi publication data');
        }
        return null;
    }

    public async getListSearchConfigByListType(listType: string, userId: string): Promise<any> {
        try {
            const header = { headers: { 'x-requester-id': userId } };
            const response = await dataManagementApi.get(`/publication/search/config/${listType}`, header);
            return response.data;
        } catch (error) {
            if (error.response?.status !== 404) {
                logHelper.logErrorResponse(error, 'retrieve list search config by list type');
            }
        }
        return null;
    }

    public async createListSearchConfig(payload: any, userId: string): Promise<boolean> {
        try {
            await dataManagementApi.post('/publication/search/config', payload, {
                headers: { 'x-requester-id': userId },
            });
            return true;
        } catch (error) {
            logHelper.logErrorResponse(error, 'create list search config');
        }
        return false;
    }

    public async updateListSearchConfig(id: string, payload: any, userId: string): Promise<boolean> {
        try {
            await dataManagementApi.put(`/publication/search/config/${id}`, payload, {
                headers: { 'x-requester-id': userId },
            });
            return true;
        } catch (error) {
            logHelper.logErrorResponse(error, 'update list search config');
        }
        return false;
    }
}
