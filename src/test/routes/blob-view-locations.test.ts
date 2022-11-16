import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../main/app';

describe('Admin rejected login page', () => {
  describe('on GET', () => {
    test('should return blob-view-locations page', async () => {
      app.request['user'] = {
        id: '1', '_json': {
          'extension_UserRole': 'SYSTEM_ADMIN',
        },
      };
      await request(app)
        .get('/blob-view-locations')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});
