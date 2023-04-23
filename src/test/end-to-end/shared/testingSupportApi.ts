import superagent from 'superagent';
import { config as testConfig } from '../../config';
import fs from 'fs';
import {
    getDataManagementCredentials,
    getSubscriptionManagementCredentials,
} from '../../../main/resources/requests/utils/axiosConfig';
import path from 'path/posix';
import os from 'os';

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

    const filePath = path.join(os.tmpdir(), csvFile);
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
            .set('x-provenance-user-id', `${testConfig.SYSTEM_ADMIN_PROVENANCE_ID}`)
            .set({ Authorization: 'Bearer ' + token.access_token });
    } catch (e) {
        throw new Error(`Failed to delete location with locationId: ${locationId}, http-status: ${e.response?.status}`);
    }
};

export const createSubscription = async (locationId: string, locationName: string, userId: string) => {
    const token = await getSubscriptionManagementCredentials();
    const payload = {
        channel: 'EMAIL',
        searchType: 'LOCATION_ID',
        searchValue: locationId,
        locationName: locationName,
        listType: null,
        userId: userId,
    };
    try {
        await superagent
            .post(`${testConfig.SUBSCRIPTION_MANAGEMENT_BASE_URL}/subscription`)
            .send(payload)
            .set({ Authorization: 'Bearer ' + token.access_token })
            .set('x-user-id', `${testConfig.VERIFIED_USER_ID}`);
    } catch (e) {
        throw new Error(`Create subscription failed for: ${locationName}, http-status: ${e.response?.status}`);
    }
};

export const deleteSubscription = async (userId: string) => {
    const token = await getSubscriptionManagementCredentials();
    try {
        await superagent
            .delete(`${testConfig.SUBSCRIPTION_MANAGEMENT_BASE_URL}/subscription/user/${userId}`)
            .set({ Authorization: 'Bearer ' + token.access_token })
            .set('x-user-id', `${testConfig.VERIFIED_USER_ID}`);
    } catch (e) {
        throw new Error(`Delete subscription failed for: ${userId}, http-status: ${e.response?.status}`);
    }
};

export const uploadPublication = async (
    sensitivity: string,
    locationId: string,
    displayFrom: string,
    displayTo: string,
    language: string,
    listName = 'civilAndFamilyDailyCauseList.json',
    listType = 'CIVIL_AND_FAMILY_DAILY_CAUSE_LIST'
) => {
    const token = await getDataManagementCredentials();

    const filePath = path.join(__dirname, './mocks/' + listName);
    const file = createFile(filePath, listName);
    try {
        await superagent
            .post(`${testConfig.DATA_MANAGEMENT_BASE_URL}/publication`)
            .send(JSON.parse(file.file.body.toString()))
            .set('x-provenance', 'MANUAL_UPLOAD')
            .set('x-type', 'LIST')
            .set('x-sensitivity', sensitivity)
            .set('x-language', language)
            .set('x-display-from', displayFrom)
            .set('x-display-to', displayTo)
            .set('x-list-type', listType)
            .set('x-court-id', locationId)
            .set('x-content-date', displayFrom)
            .set('Content-Type', 'application/json')
            .set({ Authorization: 'Bearer ' + token.access_token });
    } catch (e) {
        throw new Error(`Failed to upload publication for: ${locationId}, http-status: ${e.response?.status}`);
    }
};

export const deletePublicationForCourt = async (locationId: string) => {
    const token = await getDataManagementCredentials();
    try {
        await superagent
            .delete(`${testConfig.DATA_MANAGEMENT_BASE_URL}/publication/${locationId}/deleteArtefacts`)
            .set('x-provenance-user-id', `${testConfig.SYSTEM_ADMIN_PROVENANCE_ID}`)
            .set({ Authorization: 'Bearer ' + token.access_token });
    } catch (e) {
        throw new Error(`Failed to delete artefact for: ${locationId}, http-status: ${e.response?.status}`);
    }
};
