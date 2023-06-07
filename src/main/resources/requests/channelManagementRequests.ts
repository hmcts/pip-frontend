import { channelManagementApi } from './utils/axiosConfig';
import { Logger } from '@hmcts/nodejs-logging';

const logger = Logger.getLogger('requests');

export class ChannelManagementRequests {
    /**
     * Request to channel management to retrieve the stored PDF or Excel file from Azure blob storage.
     * @param artefactId the artefact ID of the PDF or Excel file in Azure blob storage.
     */
    public async getStoredFile(artefactId, headers: object): Promise<string | null> {
        try {
            const response = await channelManagementApi.get(`/publication/v2/${artefactId}`, { headers });
            return response.data;
        } catch (error) {
            if (error.response) {
                logger.error(`Failed to get stored ${headers['x-list-type']} file from blob storage on response`);
            } else {
                logger.error(`Failed to get stored ${headers['x-list-type']} file from blob storage with message`);
            }
            return null;
        }
    }
}
