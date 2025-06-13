import { Location } from '../../models/Location';
import { dataManagementApi } from './utils/axiosConfig';
import { Logger } from '@hmcts/nodejs-logging';
import { LogHelper } from '../logging/logHelper';
import { LocationMetadata } from '../../models/LocationMetadata';

const logger = Logger.getLogger('requests');
const logHelper = new LogHelper();

export class LocationRequests {
    public async getLocation(locationId: number): Promise<Location> {
        try {
            const response = await dataManagementApi.get(`/locations/${locationId}`);
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, `retrieve location with ID ${locationId}`);
        }
        return null;
    }

    public async getLocationByName(courtName: string, language: string): Promise<Location> {
        try {
            const response = await dataManagementApi.get(`/locations/name/${courtName}/language/${language}`);
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, `retrieve location with name ${courtName}`);
        }
        return null;
    }

    public async getFilteredCourts(regions: string, jurisdictions: string, language: string): Promise<Array<Location>> {
        try {
            const response = await dataManagementApi.get('/locations/filter', {
                params: {
                    regions: regions,
                    jurisdictions: jurisdictions,
                    language: language,
                },
            });
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, 'retrieve filtered locations');
        }
        return [];
    }

    public async getAllLocations(): Promise<Array<Location>> {
        try {
            const response = await dataManagementApi.get('/locations');
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, 'retrieve all locations');
        }
        return [];
    }

    public async deleteCourt(locationId: number, userId: string): Promise<object> {
        try {
            const header = { headers: { 'x-user-id': userId } };
            const response = await dataManagementApi.delete(`/locations/${locationId}`, header);
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, `delete location with ID ${locationId}`);
        }
        return null;
    }

    public async addLocationMetadata(payload: any, userId: string): Promise<boolean> {
        try {
            await dataManagementApi.post('/location-metadata', payload, {
                headers: { 'x-requester-id': userId },
            });
            return true;
        } catch (error) {
            logHelper.logErrorResponse(error, 'create location metadata');
        }
        return false;
    }

    public async getLocationsCsv(userId: string): Promise<Blob> {
        try {
            const response = await dataManagementApi.get('/locations/download/csv', {
                responseType: 'arraybuffer',
            });
            logger.info(`Reference data download requested by user with ID ${userId}`);
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, 'retrieve location reference data');
        }
        return null;
    }

    public async getLocationMetadata(locationId: number): Promise<LocationMetadata> {
        try {
            const response = await dataManagementApi.get(`/location-metadata/location/${locationId}`);
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, 'get location metadata by locationId');
        }
        return null;
    }

    public async updateLocationMetadata(id: string, payload, userId: string): Promise<boolean> {
        try {
            await dataManagementApi.put(`/location-metadata/${id}`, payload, {
                headers: { 'x-requester-id': userId },
            });
            return true;
        } catch (error) {
            logHelper.logErrorResponse(error, 'update location metadata');
        }
        return false;
    }

    public async deleteLocationMetadata(id: string, requesterId: string): Promise<boolean> {
        try {
            await dataManagementApi.delete(`/location-metadata/${id}`, {
                headers: { 'x-requester-id': requesterId },
            });
            return true;
        } catch (error) {
            logHelper.logErrorResponse(error, 'delete location metadata');
        }
        return false;
    }
}
