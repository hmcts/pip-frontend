import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';
import { app } from '../../main/app';
import {request as expressRequest} from 'express';
import {SubscriptionService} from '../../main/service/subscriptionService';

expressRequest['user'] = {'_json': {
  'extension_UserRole': 'VERIFIED',
}};

describe('Subscription Configure list confirmation result', () => {
  describe('on POST', () => {
    test('should show subscription list type confirmation page', async () => {
      sinon.stub(SubscriptionService.prototype, 'configureListTypeForLocationSubscriptions')
        .withArgs('1', 'CIVIL_DAILY_CAUSE_LIST')
        .resolves(true);

      await request(app)
        .post('/subscription-configure-list-confirmed')
        .send({'list-selections[]': 'CIVIL_DAILY_CAUSE_LIST'})
        .expect((res) => {
          expect(res.status).to.equal(200);
        });
    });
  });
});
