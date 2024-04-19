import { ChannelManagementRequests } from '../resources/requests/ChannelManagementRequests';
import { FileType } from '../helpers/consts';
import { AccountManagementRequests } from '../resources/requests/AccountManagementRequests';
import stream from 'stream';

const channelManagementRequests = new ChannelManagementRequests();
const accountManagementRequests = new AccountManagementRequests();

const numberOfBytes = 1024;

export class ListDownloadService {
    public async showDownloadButton(artefactId, user): Promise<boolean> {
        return user && user['roles'] === 'VERIFIED' ? await channelManagementRequests.fileExists(artefactId) : false;
    }

    public async getFile(artefactId, userId, fileExtension): Promise<string> {
        if (artefactId) {
            return await channelManagementRequests.getStoredFile(artefactId, {
                'x-user-id': userId,
                'x-file-type': Object.keys(FileType)[Object.values(FileType).indexOf(fileExtension)],
            });
        }
        return null;
    }

    public async getFileSize(artefactId, fileExtension): Promise<string> {
        const byteUnits = ['KB', 'MB'];
        const fileSizes = await channelManagementRequests.getFileSizes(artefactId);

        if (fileSizes) {
            let fileSize;
            if (fileExtension === FileType.PDF) {
                fileSize = fileSizes.primaryPdf;
            } else if (fileExtension === FileType.EXCEL) {
                fileSize = fileSizes.excel;
            }

            if (fileSize != null) {
                let i = 0;
                do {
                    fileSize /= numberOfBytes;
                    i++;
                } while (fileSize >= numberOfBytes && i <= byteUnits.length);

                return Math.max(fileSize, 0.1).toFixed(1) + byteUnits[i - 1];
            }
        }
        return null;
    }

    public handleFileDownload(res, fileContents) {
        const readStream = new stream.PassThrough();
        readStream.end(fileContents);
        readStream.pipe(res);
    }

    public async checkUserIsAuthorised(userId, listType, sensitivity): Promise<boolean | null> {
        return await accountManagementRequests.isAuthorised(userId, listType, sensitivity);
    }
}
