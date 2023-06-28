import { ChannelManagementRequests } from '../resources/requests/channelManagementRequests';
import { Logger } from '@hmcts/nodejs-logging';
import os from 'os';
import fs from 'fs';
import path from 'path';
import { FileType } from '../models/consts';

const channelManagementRequests = new ChannelManagementRequests();
const logger = Logger.getLogger('list-download');

export class ListDownloadService {
    public async generateFiles(artefactId, user): Promise<boolean> {
        if (user && user['roles'] === 'VERIFIED') {
            const pdfResponse = await this.generateFile(artefactId, user['userId'], FileType.PDF);
            const excelResponse = await this.generateFile(artefactId, user['userId'], FileType.EXCEL);
            if (pdfResponse || excelResponse) {
                return true;
            }
        }
        return false;
    }

    private async generateFile(artefactId, userId, fileExtension): Promise<string | null> {
        const response = await this.downloadFileFromBlobStorage(artefactId, userId, fileExtension);

        if (response) {
            const fileName = path.join(os.tmpdir(), `${artefactId}.${fileExtension}`);

            try {
                fs.writeFileSync(fileName, Buffer.from(response, 'base64'));
            } catch (err) {
                const fileType = Object.keys(FileType)[Object.values(FileType).indexOf(fileExtension)];
                logger.error(`Failed to write ${fileType} file to disk`, err.message);
            }
        }
        return response;
    }

    /**
     * Retrieves the file using the Artefact ID and File Type.
     * @param artefactId The Artefact ID.
     * @param fileExtension The File extension.
     * @returns The path to the file, or null if the file does not exist in the tmp directory.
     */
    public getFile(artefactId, fileExtension): string {
        if (artefactId && fileExtension) {
            const jointPath = path.join(os.tmpdir(), `${artefactId}.${fileExtension}`);

            if (fs.existsSync(jointPath)) {
                return jointPath;
            }
        }
        return null;
    }

    public getFileSize(artefactId, fileExtension): string {
        const byteUnits = ['KB', 'MB'];
        const file = this.getFile(artefactId, fileExtension);

        if (file) {
            const stats = fs.statSync(file);
            let fileSizeInBytes = stats.size;
            let i = 0;

            do {
                fileSizeInBytes /= 1000;
                i++;
            } while (fileSizeInBytes >= 1000 && i <= byteUnits.length);

            return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i - 1];
        }
        return null;
    }

    private async downloadFileFromBlobStorage(artefactId, userId, fileExtension): Promise<string | null> {
        if (artefactId) {
            return channelManagementRequests.getStoredFile(artefactId, {
                'x-user-id': userId,
                'x-file-type': Object.keys(FileType)[Object.values(FileType).indexOf(fileExtension)],
            });
        }
        return null;
    }
}
