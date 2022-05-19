import { expect } from 'chai';
import { app } from '../../main/app';
import request from 'supertest';
import sinon from 'sinon';
import { AdminAuthentication } from '../../main/authentication/adminAuthentication';

const PAGE_URL = '/upload-confirmation';
sinon.stub(AdminAuthentication.prototype, 'isAdminUser').returns(true);

describe('Upload confirmation', () => {
  describe('on GET', () => {
    test('should return upload confirmation page', async () => {
      app.request['user'] = {id: '1'};
      await request(app).get(PAGE_URL).expect((res) => expect(res.status).to.equal(200));
    });
  });
});
