import { expect } from 'chai';
import { app } from '../../main/app';
import request from 'supertest';
import sinon from 'sinon';
import {AdminAuthentication} from '../../main/authentication/adminAuthentication';

const PAGE_URL = '/remove-list-success';
sinon.stub(AdminAuthentication.prototype, 'isAdminUser').returns(true);

describe('Remove list success', () => {
  test('should return remove list success page', async () => {
    await request(app).get(PAGE_URL).expect((res) => expect(res.status).to.equal(200));
  });
});
