import request from 'supertest';
import {app} from '../../main/app';

describe('Logout', () => {
  test('should redirect to the homepage', async () => {
    await request(app)
      .get('/logout')
      .expect((res) => expect(res.redirect).toBeTruthy);
  });
});
