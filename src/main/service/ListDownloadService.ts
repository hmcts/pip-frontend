import { PublicationFileRequests } from '../resources/requests/PublicationFileRequests';
import { FileType } from '../helpers/consts';
import { AccountManagementRequests } from '../resources/requests/AccountManagementRequests';
import stream from 'stream';

const publicationFileRequests = new PublicationFileRequests();
const accountManagementRequests = new AccountManagementRequests();

const numberOfBytes = 1024;

export class ListDownloadService {
    public async showDownloadButton(artefactId, user): Promise<boolean> {
        return user && user['roles'] === 'VERIFIED'
            ? await publicationFileRequests.fileExists(artefactId, {
                  'x-requester-id': user['userId'],
              })
            : false;
    }

    public async getFile(artefactId, userId, fileExtension): Promise<string> {
        if (artefactId) {
            const fileType = Object.keys(FileType)[Object.values(FileType).indexOf(fileExtension)];
            return await publicationFileRequests.getStoredFile(artefactId, fileType, {
                'x-requester-id': userId,
            });
        }
        return null;
    }

    public async getFileSize(artefactId, fileExtension, userId): Promise<string> {
        const byteUnits = ['KB', 'MB'];
        const fileSizes = await publicationFileRequests.getFileSizes(artefactId, {
            'x-requester-id': userId,
        });

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
