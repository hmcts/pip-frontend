import { ChannelManagementRequests } from '../resources/requests/channelManagementRequests';
import { Logger } from '@hmcts/nodejs-logging';
import os from 'os';
import fs from 'fs';
import path from 'path';

const channelManagementRequests = new ChannelManagementRequests();
const logger = Logger.getLogger('list-download');

enum FileType {
    PDF = 'pdf',
    EXCEL = 'xlsx',
}

export class ListDownloadService {
    public async generateFiles(artefactId): Promise<object | null> {
        const response = await this.downloadFilesFromBlobStorage(artefactId);

        if (response) {
            const artefactData = JSON.parse(JSON.stringify(response));
            const pdfFileName = path.join(os.tmpdir(), `${artefactId}.${FileType.PDF}`);
            const excelFileName = path.join(os.tmpdir(), `${artefactId}.${FileType.EXCEL}`);

            try {
                fs.writeFileSync(pdfFileName, Buffer.from(artefactData.PDF, 'base64'));
                fs.writeFileSync(excelFileName, Buffer.from(artefactData.EXCEL, 'base64'));
            } catch (err) {
                logger.error('Failed to write file to disk', err.message);
            }
        }
        return response;
    }

    /**
     * Retrieves the file using the Artefact ID and File Type.
     * @param artefactId The Artefact ID.
     * @param fileType The File Type.
     * @returns The path to the file, or null if the file does not exist in the tmp directory.
     */
    public getFile(artefactId, fileType): string {
        if (artefactId && fileType) {
            const jointPath = path.join(os.tmpdir(), `${artefactId}.${FileType[fileType.toUpperCase()]}`);

            if (fs.existsSync(jointPath)) {
                return jointPath;
            }
        }
        return null;
    }

    public getFileSize(artefactId, fileType): string {
        const byteUnits = ['KB', 'MB'];
        const file = this.getFile(artefactId, fileType);

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

    private async downloadFilesFromBlobStorage(artefactId): Promise<object> {
        if (artefactId) {
            return channelManagementRequests.getStoredFiles(artefactId);
        }
        return null;
    }
}
