import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../main/app';
import sinon from 'sinon';
import {request as expressRequest} from 'express';
import {ManualUploadService} from '../../main/service/manualUploadService';
import {multerFile} from '../unit/mocks/multerFile';
import { FileHandlingService } from '../../main/service/fileHandlingService';

sinon.stub(expressRequest, 'isAuthenticated').returns(true);

describe('Manual upload', () => {
  describe('on GET', () => {
    test('should return manual upload page', async () => {
      await request(app)
        .get('/manual-upload')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
  describe('on POST', () => {
    beforeEach(() => {
      app.request['user'] = {emails: ['test@email.com']};
    });
    test('should render manual upload page if errors present', async () => {
      await request(app)
        .post('/manual-upload')
        .expect((res) => expect(res.status).to.equal(200));
    });
    test('should redirect to summary page', async () => {
      app.request['file'] = multerFile('testFile', 1000);
      sinon.stub(FileHandlingService.prototype, 'validateFileUpload').returns(null);
      sinon.stub(ManualUploadService.prototype, 'validateFormFields').resolves(null);
      sinon.stub(ManualUploadService.prototype, 'appendCourtId').resolves({});
      await request(app)
        .post('/manual-upload')
        .expect(res => {
          expect(res.status).to.equal(302);
          expect(res.header['location']).to.equal('/manual-upload-summary?check=true');
        });
    });
  });
});
