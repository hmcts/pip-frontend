import sinon from 'sinon';
import { expect } from 'chai';
import { ChannelManagementRequests } from '../../../main/resources/requests/channelManagementRequests';
import { ListDownloadService } from '../../../main/service/listDownloadService';
import fs from 'fs';
import path from 'path';
import os from 'os';

const listDownloadService = new ListDownloadService();
const artefactId = '123';
const userId = '1234';

const expectedPdfData = 'abc';
const expectedExcelData = 'def';

const downloadFilesStub = sinon.stub(ChannelManagementRequests.prototype, 'getStoredFile');
downloadFilesStub.withArgs('123', { 'x-user-id': '1234', 'x-file-type': 'PDF' }).resolves(expectedPdfData);
downloadFilesStub.withArgs('123', { 'x-user-id': '1234', 'x-file-type': 'EXCEL' }).resolves(expectedExcelData);

downloadFilesStub.withArgs('124', { 'x-user-id': '1234', 'x-file-type': 'PDF' }).resolves(null);
downloadFilesStub.withArgs('124', { 'x-user-id': '1234', 'x-file-type': 'EXCEL' }).resolves(expectedExcelData);

downloadFilesStub.withArgs('125', { 'x-user-id': '1234', 'x-file-type': 'PDF' }).resolves(expectedPdfData);
downloadFilesStub.withArgs('125', { 'x-user-id': '1234', 'x-file-type': 'EXCEL' }).resolves(null);

const statstub = sinon.stub(fs, 'statSync').returns({ size: 1000 });
const existsSyncStub = sinon.stub(fs, 'existsSync');

describe('List Download Service', () => {
    describe('Get file', () => {
        it('should return expected PDF file', async () => {
            existsSyncStub.returns(true);
            const response = await listDownloadService.getFile(artefactId, 'pdf');
            expect(response)
                .to.be.a('string')
                .and.satisfy(msg => msg.endsWith(artefactId + '.pdf'));
        });

        it('should return expected excel file', async () => {
            existsSyncStub.returns(true);
            const response = await listDownloadService.getFile(artefactId, 'xlsx');
            expect(response)
                .to.be.a('string')
                .and.satisfy(msg => msg.endsWith(artefactId + '.xlsx'));
        });

        it('should not return file if no artefact ID provided', async () => {
            const response = await listDownloadService.getFile(null, 'xlsx');
            expect(response).to.be.null;
        });

        it('should not return file if no file type provided', async () => {
            const response = await listDownloadService.getFile(artefactId, null);
            expect(response).to.be.null;
        });

        it('should not return file if the file does not exist', async () => {
            existsSyncStub.returns(false);
            const response = await listDownloadService.getFile(artefactId, null);
            expect(response).to.be.null;
        });
    });

    describe('Get file size', () => {
        it('should return file size in KB', async () => {
            existsSyncStub.returns(true);
            statstub.withArgs(path.join(os.tmpdir(), `${artefactId}.pdf`)).returns({ size: 1000 });
            const response = await listDownloadService.getFileSize(artefactId, 'pdf');
            expect(response).to.equal('1.0KB');
        });

        it('should return file size in MB', async () => {
            existsSyncStub.returns(true);
            statstub.withArgs(path.join(os.tmpdir(), `${artefactId}.pdf`)).returns({ size: 1000000 });
            const response = await listDownloadService.getFileSize(artefactId, 'pdf');
            expect(response).to.equal('1.0MB');
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

    describe('Generate files', () => {
        afterAll(() => {
            sinon.restore();
        });

        it('should return expected data', async () => {
            const artefactId = '123';
            const user = {
                userId: userId,
                roles: 'VERIFIED',
            };
            const response = await listDownloadService.generateFiles(artefactId, user);
            expect(response).to.be.true;
        });

        it('should not generate files if channel management get PDF file returns null', async () => {
            const artefactId = '124';
            const user = {
                userId: userId,
                roles: 'VERIFIED',
            };
            const response = await listDownloadService.generateFiles(artefactId, user);
            expect(response).to.be.true;
        });

        it('should not generate files if channel management get Excel file returns null', async () => {
            const artefactId = '125';
            const user = {
                userId: userId,
                roles: 'VERIFIED',
            };
            const response = await listDownloadService.generateFiles(artefactId, user);
            expect(response).to.be.true;
        });

        it('should not generate files if no artefact ID provided', async () => {
            const user = {
                userId: userId,
                roles: 'VERIFIED',
            };
            const response = await listDownloadService.generateFiles(null, user);
            expect(response).to.be.false;
        });

        it('should not generate files if roles not VERIFIED', async () => {
            const user = {
                userId: userId,
                roles: 'INTERNAL_SUPER_ADMIN_CTSC',
            };
            const response = await listDownloadService.generateFiles(artefactId, user);
            expect(response).to.be.false;
        });

        it('should not generate files if no user', async () => {
            const response = await listDownloadService.generateFiles(artefactId, null);
            expect(response).to.be.false;
        });
    });
});
