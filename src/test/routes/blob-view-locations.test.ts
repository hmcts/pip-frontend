import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';
import { app } from '../../main/app';
import { PublicationRequests } from '../../main/resources/requests/publicationRequests';

describe('Admin rejected login page', () => {
  sinon.stub(PublicationRequests.prototype, 'getPubsPerLocation').returns('location,count\n1,2\n3,1\n');
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
