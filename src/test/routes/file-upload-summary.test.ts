import { expect } from 'chai';
import { app } from '../../main/app';
import { request as expressRequest } from 'express';
import request from 'supertest';
import sinon from 'sinon';
import { AdminService } from '../../main/service/adminService';

sinon.stub(expressRequest, 'isAuthenticated').returns(true);
const uploadStub = sinon.stub(AdminService.prototype, 'uploadPublication');
uploadStub.withArgs({data: 'valid'}, 'arguments', '1').resolves(true);
uploadStub.withArgs({data: 'invalid'}, 'arguments', '1').resolves(false);
const PAGE_URL = '/file-upload-summary';

describe('File upload summary', () => {
  beforeEach(() => {
    app.request['user'] = {id: '1'};
  });

  describe('on GET', () => {
    test('should return file upload summary page', async () => {
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
      app['file'] = 'arguments';
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
          expect(res.header['location']).to.equal('/upload-confirmation');
        });
    });
  });
});
