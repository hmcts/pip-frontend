import { channelManagementApi } from './utils/axiosConfig';
import { LogHelper } from '../logging/logHelper';

const logHelper = new LogHelper();

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
            logHelper.logErrorResponse(
                error,
                `retrieve stored ${headers['x-list-type']} file from blob storage for publication with ID ${artefactId}`
            );
        }
        return null;
    }
}
