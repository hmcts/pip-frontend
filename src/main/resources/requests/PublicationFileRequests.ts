import { dataManagementApi } from './utils/axiosConfig';
import { LogHelper } from '../logging/logHelper';
import { PublicationFileSizes } from '../../models/PublicationFileSizes';

const logHelper = new LogHelper();

export class PublicationFileRequests {
    /**
     * Request to data management to retrieve the stored PDF or Excel file from Azure blob storage.
     * @param artefactId the artefact ID of the PDF or Excel file in Azure blob storage.
     */
    public async getStoredFile(artefactId, fileType, headers: object): Promise<string | null> {
        try {
            const response = await dataManagementApi.get(`/publication/${artefactId}/${fileType}`, { headers });
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(
                error,
                `retrieve stored ${headers['x-list-type']} file from blob storage for publication with ID ${artefactId}`
            );
        }
        return null;
    }

    /**
     * Request to data management to check if any publication file exists.
     * @param artefactId the artefact ID of the publication files in Azure blob storage.
     */
    public async fileExists(artefactId: string, headers: object): Promise<boolean> {
        try {
            const response = await dataManagementApi.get(`/publication/${artefactId}/exists`, { headers });
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(
                error,
                `check existence of file in blob storage for publication with ID ${artefactId}`
            );
        }
        return false;
    }

    /**
     * Request to data management to retrieve the sizes of all publication files
     * @param artefactId the artefact ID of the publication files in Azure blob storage.
     */
    public async getFileSizes(artefactId: string,  headers: object): Promise<PublicationFileSizes> {
        try {
            const response = await dataManagementApi.get(`/publication/${artefactId}/sizes`, { headers });
            return response.data;
        } catch (error) {
            logHelper.logErrorResponse(
                error,
                `retrieve stored file sizes from blob storage for publication with ID ${artefactId}`
            );
        }
        return null;
    }
}
