import sinon from 'sinon';
import { expect } from 'chai';
import { ChannelManagementRequests } from '../../../main/resources/requests/ChannelManagementRequests';
import { ListDownloadService } from '../../../main/service/ListDownloadService';
import { AccountManagementRequests } from '../../../main/resources/requests/AccountManagementRequests';

const listDownloadService = new ListDownloadService();
const artefactId = '123';
const userId = '1234';

const expectedPdfData = 'abc';
const expectedExcelData = 'def';
const listType = 'SJP_PRESS_LIST';
const sensitivity = 'CLASSIFIED';

const isAuthorisedStub = sinon.stub(AccountManagementRequests.prototype, 'isAuthorised');
isAuthorisedStub.withArgs('1').resolves(true);
isAuthorisedStub.withArgs('2').resolves(false);

const fileExistsStub = sinon.stub(ChannelManagementRequests.prototype, 'fileExists');
fileExistsStub.withArgs('123').resolves(true);
fileExistsStub.withArgs('124').resolves(false);

const downloadFilesStub = sinon.stub(ChannelManagementRequests.prototype, 'getStoredFile');
downloadFilesStub.withArgs('123', { 'x-user-id': '1234', 'x-file-type': 'PDF' }).resolves(expectedPdfData);
downloadFilesStub.withArgs('123', { 'x-user-id': '1234', 'x-file-type': 'EXCEL' }).resolves(expectedExcelData);
downloadFilesStub.withArgs('124', { 'x-user-id': '1234', 'x-file-type': 'PDF' }).resolves(null);

const getFileSizeStub = sinon.stub(ChannelManagementRequests.prototype, 'getFileSizes');
getFileSizeStub.withArgs('123').resolves({
    primaryPdf: 1024,
    additionalPdf: null,
    excel: 512,
});
getFileSizeStub.withArgs('124').resolves({
    primaryPdf: 1048576,
    additionalPdf: null,
    excel: null,
});

describe('List Download Service', () => {
    describe('Check user is authorised', () => {
        it('should return true if user is authorised', async () => {
            const response = await listDownloadService.checkUserIsAuthorised('1', listType, sensitivity);
            expect(response).to.be.true;
        });

        it('should return false if unauthorised', async () => {
            const response = await listDownloadService.checkUserIsAuthorised('2', listType, sensitivity);
            expect(response).to.be.false;
        });
    });

    describe('Show download button', () => {
        it('should show download button for verified user if file exists', async () => {
            const user = {
                userId: userId,
                roles: 'VERIFIED',
            };
            const response = await listDownloadService.showDownloadButton(artefactId, user);
            expect(response).to.be.true;
        });

        it('should not show download button for verified user if file does not exist', async () => {
            const user = {
                userId: userId,
                roles: 'VERIFIED',
            };
            const response = await listDownloadService.showDownloadButton('124', user);
            expect(response).to.be.false;
        });

        it('should not show download button for admin user', async () => {
            const user = {
                userId: userId,
                roles: 'INTERNAL_SUPER_ADMIN_CTSC',
            };
            const response = await listDownloadService.showDownloadButton(artefactId, user);
            expect(response).to.be.false;
        });

        it('should not show download button if no user', async () => {
            const response = await listDownloadService.showDownloadButton(artefactId, null);
            expect(response).to.be.false;
        });
    });

    describe('Get file', () => {
        it('should return expected PDF file', async () => {
            const response = await listDownloadService.getFile(artefactId, userId, 'pdf');
            expect(response).to.equal(expectedPdfData);
        });

        it('should return expected excel file', async () => {
            const response = await listDownloadService.getFile(artefactId, userId, 'xlsx');
            expect(response).to.equal(expectedExcelData);
        });

        it('should return null if channel management does not return any file', async () => {
            const response = await listDownloadService.getFile('124', userId, 'pdf');
            expect(response).to.be.null;
        });

        it('should not return file if no artefact ID provided', async () => {
            const response = await listDownloadService.getFile(null, userId, 'pdf');
            expect(response).to.be.null;
        });
    });

    describe('Get file size', () => {
        it('should return file size in KB', async () => {
            const response = await listDownloadService.getFileSize(artefactId, 'pdf');
            expect(response).to.equal('1.0KB');
        });

        it('should return file size in MB', async () => {
            const response = await listDownloadService.getFileSize('124', 'pdf');
            expect(response).to.equal('1.0MB');
        });

        it('should return file size for excel', async () => {
            const response = await listDownloadService.getFileSize(artefactId, 'xlsx');
            expect(response).to.equal('0.5KB');
        });

        it('should not return file size if no artefact ID provided', async () => {
            const response = await listDownloadService.getFileSize(null, 'excel');
            expect(response).to.be.null;
        });

        it('should not return file size if no file type provided', async () => {
            const response = await listDownloadService.getFileSize(artefactId, null);
            expect(response).to.be.null;
        });
    });
});
