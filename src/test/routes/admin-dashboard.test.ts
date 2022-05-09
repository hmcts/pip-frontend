import { app } from '../../main/app';
import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';
import {AdminAuthentication} from '../../main/authentication/adminAuthentication';

sinon.stub(AdminAuthentication.prototype, 'isAdminUser').returns(true);

describe('Admin Dashboard Home', () => {
  describe('on GET', () => {
    test('should return admin dashboard page', async () => {
      await request(app)
        .get('/admin-dashboard')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});
