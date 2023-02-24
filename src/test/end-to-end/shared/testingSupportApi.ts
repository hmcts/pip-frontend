import superagent from 'superagent';
import { config as testConfig } from '../../config';
import fs from 'fs';
import { getDataManagementCredentials } from '../../../main/resources/requests/utils/axiosConfig';
import path from 'path/posix';

const createFile = (filePath, fileName) => {
    return {
        file: {
            body: fs.readFileSync(filePath),
            name: fileName,
        },
    };
};

export const createLocation = async (csvFile: string) => {
    const token = await getDataManagementCredentials();

    const filePath = path.join(__dirname, './mocks/' + csvFile);
    const file = createFile(filePath, csvFile);
    try {
        await superagent
            .post(`${testConfig.DATA_MANAGEMENT_BASE_URL}/locations/upload`)
            .set('enctype', 'multipart/form-data')
            .set({ Authorization: 'Bearer ' + token.access_token })
            .attach('locationList', file.file.body, file.file.name);
    } catch (e) {
        throw new Error(`Failed to create location , http-status: ${e.response?.status}`);
    }
};

export const deleteLocation = async (locationId: string) => {
    const token = await getDataManagementCredentials();
    try {
        await superagent
            .delete(`${testConfig.DATA_MANAGEMENT_BASE_URL}/locations/${locationId}`)
            .set('x-provenance-user-id', 'get it from environment variable')
            .set({ Authorization: 'Bearer ' + token.access_token });
    } catch (e) {
        throw new Error(`Failed to delete location with locationId: ${locationId}, http-status: ${e.response?.status}`);
    }
};

export const createSubscription = async (locationId: string) => {
    const payload = {
        channel: 'EMAIL',
        searchType: '100',
        searchValue: locationId,
        locationName: 'Test Court',
        listType: null,
        userId: '12',
    };
    try {
        await superagent
            .post('http://localhost:4550/subscription')
            .send(payload)
            .set('x-user-id', 'get it from environment variable');
    } catch (e) {
        throw new Error(`Failed : ${locationId}, http-status: ${e.response?.status}`);
    }
};
