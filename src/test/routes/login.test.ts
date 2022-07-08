import request from 'supertest';
import {app} from '../../main/app';

describe('Login', () => {
  test('should redirect to the subscription management page', async () => {
    await request(app)
      .get('/login')
      .expect((res) => expect(res.redirect).toBeTruthy);
  });

  test('should redirect to the subscription management page on return', async () => {
    await request(app)
      .post('/login/return')
      .expect((res) => expect(res.redirect).toBeTruthy());
  });

  test('should redirect to azure again if password reset error is returned from the B2C', async() => {
    await request(app)
      .post('/login/return')
      .send({'error':'access_denied', 'error_description':'AADB2C90118'})
      .expect((res) => expect(res.redirect).toBeTruthy());
  });
});
