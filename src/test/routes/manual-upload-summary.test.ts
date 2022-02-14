import { expect } from 'chai';
import { app } from '../../main/app';
import { request as expressRequest } from 'express';
import request from 'supertest';
import sinon from 'sinon';
import { ManualUploadService } from '../../main/service/manualUploadService';

const PAGE_URL = '/manual-upload-summary';
const mockCookie = {'foo': 'blah', listType: ''};
const uploadStub = sinon.stub(ManualUploadService.prototype, 'uploadPublication');
sinon.stub(ManualUploadService.prototype, 'readFile').returns('');
sinon.stub(ManualUploadService.prototype, 'removeFile').returns(true);
sinon.stub(ManualUploadService.prototype, 'getListItemName').returns('');
uploadStub.withArgs({  ...mockCookie,  listTypeName: '', file: '', userId: '1' }, true).resolves(true);
uploadStub.withArgs({ ...mockCookie,  listTypeName: '', file: '', userId: '2' }, true).resolves(false);

sinon.stub(expressRequest, 'isAuthenticated').returns(true);

describe('Manual upload summary', () => {
  beforeEach(() => {
    app.request['user'] = {id: '1'};
    app.request['cookies'] = {'formCookie': JSON.stringify(mockCookie)};
  });

  describe('on GET', () => {
    test('should return file upload summary page', async () => {
      console.log('app', app.request);
      await request(app).get(PAGE_URL).expect((res) => expect(res.status).to.equal(200));
    });

    test('should return file upload summary page with error summary', async () => {
      await request(app)
        .get(`${PAGE_URL}?query=true`)
        .expect((res) => expect(res.status).to.equal(200));
    });
  });

  describe('on POST', () => {
    test('should return summary page if query param is check', async () => {
      app['file'] = 'arguments';
      await request(app).post(`${PAGE_URL}?check=true`)
        .send({data: 'valid'})
        .expect((res) => expect(res.status).to.equal(200));
    });

    test('should return summary page if upload fails', async () => {
      app.request['user'] = {id: '2'};
      await request(app).post(PAGE_URL)
        .send({data: 'invalid'})
        .expect((res) => expect(res.status).to.equal(200));
    });

    test('should redirect to upload success page', async () => {
      app['file'] = 'arguments';
      await request(app).post(PAGE_URL)
        .send({data: 'valid'})
        .expect((res) => {
          expect(res.status).to.equal(302);
          expect(res.header['location']).to.equal('upload-confirmation');
        });
    });
  });
});
