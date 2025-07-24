import { dataManagementApi, getDataManagementCredentials } from './utils/axiosConfig';
import { LogHelper } from '../logging/logHelper';
import superagent from 'superagent';

const logHelper = new LogHelper();

export class DataManagementRequests {
    public dataManagementAPI =
        process.env.DATA_MANAGEMENT_URL || 'https://pip-data-management.staging.platform.hmcts.net';

    public async uploadPublication(body: any, headers: object, nonStrategicUpload: boolean): Promise<string> {
        const token = await getDataManagementCredentials('');

        let uploadEndpoint = 'publication';
        if (nonStrategicUpload) {
            uploadEndpoint = uploadEndpoint + '/non-strategic';
        }
        try {
            const response = await superagent
                .post(`${this.dataManagementAPI}/${uploadEndpoint}`)
                .set('enctype', 'multipart/form-data')
                .set({ ...headers, Authorization: 'Bearer ' + token.access_token })
                .attach('file', body.file, body.fileName);
            return response.body.artefactId;
        } catch (error) {
            logHelper.logErrorResponse(error, 'upload flat files publication');
        }
        return null;
    }

    public async uploadJSONPublication(body: any, headers: object): Promise<string> {
        try {
            const response = await dataManagementApi.post('/publication', body.file, { headers });
            return response.data.artefactId;
        } catch (error) {
            logHelper.logErrorResponse(error, 'upload JSON publication');
        }
        return null;
    }

    public async uploadLocationFile(body: any): Promise<any> {
        const token = await getDataManagementCredentials('');

        try {
            await superagent
                .post(`${this.dataManagementAPI}/locations/upload`)
                .set('enctype', 'multipart/form-data')
                .set({ Authorization: 'Bearer ' + token.access_token })
                .attach('locationList', body.file, body.fileName);
            return true;
        } catch (error) {
            logHelper.logErrorResponse(error, 'upload location reference data');
            if (error.response?.status === 400 && error.response?.text) {
                const errorJson = JSON.parse(error.response.text);
                return errorJson.uiError ? errorJson.message : false;
            }
            return false;
        }
    }
}
