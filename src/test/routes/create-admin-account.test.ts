import { app } from '../../main/app';
import request from 'supertest';
import sinon from 'sinon';
import { expect } from 'chai';
import {AdminAuthentication} from '../../main/authentication/adminAuthentication';

sinon.stub(AdminAuthentication.prototype, 'isAdminUser').returns(true);
const mockData = {
  firstName: 'Joe',
  lastName: 'Bloggs',
  emailAddress: 'joe@bloggs.com',
  'user-role': 'admin-ctsc',
};

describe('Create admin account page', () => {
  describe('on GET', () => {
    test('should render admin account form', async () => {
      await request(app).get('/create-admin-account').expect((res) => expect(res.status).to.equal(200));
    });
  });

  describe('on POST', () => {
    test('should render admin account form with errors', async () => {
      await request(app).post('/create-admin-account').send({firstName: 'Joe'}).expect((res) => expect(res.status).to.equal(200));
    });

    test('should redirect to admin account summary page', async () => {
      await request(app).post('/create-admin-account').send(mockData).expect((res) => {
        expect(res.status).to.equal(302);
        expect(res.header['location']).to.equal('create-admin-account-summary');
      });
    });
  });
});
