import { Location } from '../../models/location';
import { dataManagementApi } from './utils/axiosConfig';
import { Logger } from '@hmcts/nodejs-logging';
import { LogHelper } from '../logging/logHelper';

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
        return null;
    }

    public async getAllLocations(): Promise<Array<Location>> {
        try {
            const response = await dataManagementApi.get('/locations');
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, 'retrieve all locations');
        }
        return null;
    }

    public async deleteCourt(locationId: number, adminUserId: string): Promise<object> {
        try {
            const header = { headers: { 'x-provenance-user-id': adminUserId } };

            const response = await dataManagementApi.delete(`/locations/${locationId}`, header);
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(error, `delete location with ID ${locationId}`);
        }
        return null;
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
}
