import sinon from 'sinon';
import {expect} from 'chai';
import {ChannelManagementRequests} from '../../../main/resources/requests/channelManagementRequests';
import {ListDownloadService} from '../../../main/service/listDownloadService';
import fs from 'fs';

const listDownloadService = new ListDownloadService();
const downloadFilesStub = sinon.stub(ChannelManagementRequests.prototype, 'getStoredFiles');
const artefactId = '123';

describe('List Download Service', () => {
  describe('Generate files', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('should return expected data', async () => {
      const expectedData = {
        pdf: '123',
        excel: '456',
      };
      downloadFilesStub.withArgs(artefactId).resolves(expectedData);
      const response = await listDownloadService.generateFiles(artefactId);
      expect(response).to.equal(expectedData);
    });

    it('should not generate files if channel management endpoint returns null', async () => {
      downloadFilesStub.withArgs(artefactId).resolves(null);
      const response = await listDownloadService.generateFiles(artefactId);
      expect(response).to.be.null;
    });

    it('should not generate files if no artefact ID provided', async () => {
      const response = await listDownloadService.generateFiles(null);
      expect(response).to.be.null;
    });
  });

  describe('Get file', () => {
    it('should return expected PDF file', async () => {
      const response = await listDownloadService.getFile(artefactId, 'pdf');
      expect(response).to.be.a('string').and.satisfy(msg => msg.endsWith(artefactId + '.pdf'));
    });

    it('should return expected excel file', async () => {
      const response = await listDownloadService.getFile(artefactId, 'excel');
      expect(response).to.be.a('string').and.satisfy(msg => msg.endsWith(artefactId + '.xlsx'));
    });

    it('should not return file if no artefact ID provided', async () => {
      const response = await listDownloadService.getFile(null, 'excel');
      expect(response).to.be.null;
    });

    it('should not return file if no file type provided', async () => {
      const response = await listDownloadService.getFile(artefactId, null);
      expect(response).to.be.null;
    });
  });

  describe('Get file size', () => {
    it('should return file size', async () => {
      sinon.stub(fs, 'statSync').returns({});
      const response = await listDownloadService.getFileSize(artefactId, 'pdf');
      expect(response).to.not.be.null;
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
