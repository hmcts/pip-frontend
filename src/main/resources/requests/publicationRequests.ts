import { dataManagementApi } from './utils/axiosConfig';
import { Artefact } from '../../models/Artefact';
import { HttpStatusCode } from 'axios';

export class PublicationRequests {
    public async getIndividualPublicationMetadata(artefactId, userId, admin): Promise<any> {
        try {
            let header;
            if (userId) {
                header = { headers: { 'x-user-id': userId, 'x-admin': admin } };
            } else {
                header = { headers: { 'x-admin': admin } };
            }

            const response = await dataManagementApi.get(`/publication/${artefactId}`, header);
            return response.data;
        } catch (error) {
            if (error.response) {
                if (error.response.status === 404) {
                    return HttpStatusCode.NotFound;
                } else {
                    return null;
                }
            } else {
                return null;
            }
        }
    }

    public async getPubsPerLocation(): Promise<any> {
        try {
            const response = await dataManagementApi.get('/publication/count-by-location');
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

    public async getPublicationByCaseValue(
        searchQuery: string,
        searchValue: string,
        userId: string
    ): Promise<Artefact[]> {
        try {
            let header;
            if (userId) {
                header = { headers: { 'x-user-id': userId } };
            }

            const response = await dataManagementApi.get(`/publication/search/${searchQuery}/${searchValue}`, header);
            return response.data;
        } catch (error) {
            if (error.response) {
                console.log(error.response.data);
            } else {
                console.log(`ERROR: ${error.message}`);
            }
        }
        return [];
    }

    public async getIndividualPublicationJson(artefactId, userId): Promise<HttpStatusCode> {
        try {
            let header;
            if (userId) {
                header = { headers: { 'x-user-id': userId } };
            }

            const response = await dataManagementApi.get('/publication/' + artefactId + '/payload', header);
            return response.data;
        } catch (error) {
            if (error.response) {
                if (error.response.status === 404) {
                    return HttpStatusCode.NotFound;
                } else {
                    return null;
                }
            } else {
                return null;
            }
        }
    }

    public async getIndividualPublicationFile(artefactId, userId): Promise<Blob | HttpStatusCode> {
        try {
            let header;
            if (userId) {
                header = {
                    headers: { 'x-user-id': userId },
                    responseType: 'arraybuffer',
                };
            } else {
                header = { responseType: 'arraybuffer' };
            }
            const response = await dataManagementApi.get(`/publication/${artefactId}/file`, header);
            return response.data;
        } catch (error) {
            if (error.response) {
                if (error.response.status === 404) {
                    return HttpStatusCode.NotFound;
                } else {
                    return null;
                }
            } else {
                return null;
            }
        }
    }

    public async getPublicationsByCourt(locationId: string, userId: string, admin: boolean): Promise<Artefact[]> {
        try {
            let header;
            if (userId) {
                header = { headers: { 'x-user-id': userId, 'x-admin': admin } };
            } else {
                header = { headers: { 'x-admin': admin } };
            }

            const response = await dataManagementApi.get(`/publication/locationId/${locationId}`, header);
            return response.data;
        } catch (error) {
            if (error.response) {
                console.log(error.response.data);
            } else {
                console.log(`ERROR: ${error.message}`);
            }
        }
        return [];
    }

    public async archivePublication(artefactId: string, id: string): Promise<boolean> {
        try {
            await dataManagementApi.put(`/publication/${artefactId}/archive`, {}, { headers: { 'x-issuer-id': id } });
            return true;
        } catch (error) {
            if (error.response) {
                console.log(error.response.data);
            } else {
                console.log(`ERROR: ${error.message}`);
            }
        }
        return false;
    }

    public async deleteLocationPublication(locationId: number, adminUserId: string): Promise<object> {
        try {
            const header = { headers: { 'x-provenance-user-id': adminUserId } };

            const response = await dataManagementApi.delete(`/publication/${locationId}/deleteArtefacts`, header);
            return response.data;
        } catch (error) {
            if (error.response) {
                console.log(error.response.data);
            } else if (error.request) {
                console.log(`Request failed. ${error.request}`);
            } else {
                console.log(`ERROR: ${error.message}`);
            }
            return null;
        }
    }

    public async getNoMatchPublications(): Promise<Artefact[]> {
        try {
            const response = await dataManagementApi.get(`/publication/no-match`);
            return response.data;
        } catch (error) {
            if (error.response) {
                console.log(error.response.data);
            } else {
                console.log(`ERROR: ${error.message}`);
            }
        }
        return [];
    }
}
