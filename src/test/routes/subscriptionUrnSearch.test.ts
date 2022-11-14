import { expect } from 'chai';
import { app } from '../../main/app';
import { request as expressRequest } from 'express';
import request from 'supertest';
import sinon from 'sinon';
import { PublicationService } from '../../main/service/publicationService';

expressRequest['user'] = {
  _json: {
    extension_UserRole: 'VERIFIED',
  },
};

sinon.stub(PublicationService.prototype, 'getCaseByCaseUrn').withArgs('123456789', true).resolves(true);

describe('subscription URN Search', () => {
  describe('on GET', () => {
    test('should return subscription Urn Search page', async () => {
      await request(app)
        .get('/subscription-urn-search')
        .expect(res => expect(res.status).to.equal(200));
    });
  });

  describe('on POST', () => {
    test('should return subscription urn result page', async () => {
      await request(app)
        .post('/subscription-urn-search')
        .send({ 'search-input': '123456789' })
        .expect(res => {
          expect(res.status).to.equal(200);
        });
    });
  });
});
