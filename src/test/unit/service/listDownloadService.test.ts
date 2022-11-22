import sinon from 'sinon';
import {expect} from 'chai';
import {ChannelManagementRequests} from '../../../main/resources/requests/channelManagementRequests';
import {ListDownloadService} from '../../../main/service/listDownloadService';
import fs from 'fs';
import path from 'path';
import os from 'os';

const listDownloadService = new ListDownloadService();
const artefactId = '123';

const downloadFilesStub = sinon.stub(ChannelManagementRequests.prototype, 'getStoredFiles');
const statstub = sinon.stub(fs, 'statSync').returns({size: 1000});

describe('List Download Service', () => {
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
    it('should return file size in KB', async () => {
      statstub.withArgs(path.join(os.tmpdir(), `${artefactId}.pdf`)).returns({size: 1000});
      const response = await listDownloadService.getFileSize(artefactId, 'pdf');
      expect(response).to.equal('1.0KB');
    });

    it('should return file size in MB', async () => {
      statstub.withArgs(path.join(os.tmpdir(), `${artefactId}.pdf`)).returns({size: 1000000});
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
});
