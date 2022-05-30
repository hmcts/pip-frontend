import request from 'supertest';
import {app} from '../../main/app';
import sinon from 'sinon';
import {AdminAuthentication} from '../../main/authentication/adminAuthentication';

describe('Logout', () => {
  test('should redirect to the homepage', async () => {
    await request(app)
      .get('/logout')
      .expect((res) => expect(res.redirect).toBeTruthy);
  });

  test('should redirect to the admin login page', async () => {
    sinon.stub(AdminAuthentication.prototype, 'isAdminUser').returns(true);
    await request(app)
      .get('/logout')
      .expect((res) => expect(res.redirect).toBeTruthy);
  });
});
