import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';
import { request as expressRequest } from 'express';
import { app } from '../../main/app';

sinon.stub(expressRequest, 'isAuthenticated').returns(true);

describe('UserSubscriptions Add', () => {
  describe('on GET', () => {
    test('should return subscription-add page', async () => {
      await request(app)
        .get('/subscription-add')
        .expect((res) => expect(res.status).to.equal(200));
    });
  });

  describe('on POST', () => {
    test('should return home page when selection is case-reference', async () => {
      await request(app)
        .post('/subscription-add')
        .send({'subscription-choice': 'case-reference'})
        .expect((res) => {
          expect(res.status).to.equal(302);
          expect(res.header['location']).to.equal('/case-reference-number-search');
        });
    });

    test('should return home page when selection is urn', async () => {
      await request(app)
        .post('/subscription-add')
        .send({'subscription-choice': 'urn'})
        .expect((res) => {
          expect(res.status).to.equal(302);
          expect(res.header['location']).to.equal('/subscription-urn-search');
        });
    });

    test('should return home page when selection is name', async () => {
      await request(app)
        .post('/subscription-add')
        .send({'subscription-choice': 'name'})
        .expect((res) => {
          expect(res.status).to.equal(302);
          expect(res.header['location']).to.equal('/case-name-search');
        });
    });

    test('should return home page when selection is court-or-tribunal', async () => {
      await request(app)
        .post('/subscription-add')
        .send({'subscription-choice': 'court-or-tribunal'})
        .expect((res) => {
          expect(res.status).to.equal(302);
          expect(res.header['location']).to.equal('/court-name-search');
        });
    });

    test('should return subscription-add page when no selection is made', async () => {
      await request(app)
        .post('/subscription-add')
        .send({'subscription-choice': ''})
        .expect((res) => {
          expect(res.status).to.equal(302);
          expect(res.header['location']).to.equal('/subscription-add?error=true');
        });
    });
  });

});
