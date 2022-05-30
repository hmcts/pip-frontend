import sinon from 'sinon';
import request from 'supertest';
import {app} from '../../main/app';
import {expect} from 'chai';
import {AdminAuthentication} from '../../main/authentication/adminAuthentication';

sinon.stub(AdminAuthentication.prototype, 'isAdminUser').returns(true);

describe('Media applications', () =>{
  describe('GET', () => {
    test('should return media applications page', async () => {
      await request(app)
        .get('/media-applications')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });
});
