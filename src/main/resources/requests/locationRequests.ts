import { Location } from '../../models/location';
import { dataManagementApi } from './utils/axiosConfig';

export class LocationRequests {
    public async getLocation(locationId: number): Promise<Location> {
        try {
            const response = await dataManagementApi.get(`/locations/${locationId}`);
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

    public async getLocationByName(courtName: string, language: string): Promise<Location> {
        try {
            const response = await dataManagementApi.get(`/locations/name/${courtName}/language/${language}`);
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
            if (error.response) {
                console.log(error.response.data);
            } else {
                console.log(`ERROR: ${error.message}`);
            }
        }
        return null;
    }

    public async getAllLocations(): Promise<Array<Location>> {
        try {
            const response = await dataManagementApi.get('/locations');
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

    public async deleteCourt(locationId: number, adminUserId: string): Promise<object> {
        try {
            const header = { headers: { 'x-provenance-user-id': adminUserId } };

            const response = await dataManagementApi.delete(`/locations/${locationId}`, header);
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

    public async getLocationsCsv(userId: string): Promise<Blob> {
        try {
            const response = await dataManagementApi.get('/locations/download/csv', {
                responseType: 'arraybuffer',
            });
            console.log('Reference data download requested by user with ID: ' + userId);
            return response.data;
        } catch (error) {
            if (error.response) {
                console.error('Failed to retrieve reference data csv - response', error.response.data);
            } else {
                console.error('Failed to retrieve reference data csv - message', error.message);
            }
        }
        return null;
    }
}
