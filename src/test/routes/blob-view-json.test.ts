import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../main/app';

describe('Admin rejected login page', () => {
  describe('on GET', () => {
    test('should return blob-view-json page', async () => {
      app.request['user'] = {
        id: '1', '_json': {
          'extension_UserRole': 'SYSTEM_ADMIN',
        },
      };
      await request(app)
        .get('/blob-view-json')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});
