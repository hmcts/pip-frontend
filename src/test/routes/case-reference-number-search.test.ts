import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';
import { app } from '../../main/app';
import { request as expressRequest } from 'express';
import { PublicationService } from '../../main/service/publicationService';

expressRequest['user'] = { roles: 'VERIFIED' };

sinon.stub(PublicationService.prototype, 'getCaseByCaseNumber').withArgs('56-181-2097', true).resolves(true);

describe('Case reference number search', () => {
    describe('on GET', () => {
        test('should return Case reference number search page', async () => {
            await request(app)
                .get('/case-reference-number-search')
                .expect(res => expect(res.status).to.equal(200));
        });
    });

    describe('on POST', () => {
        test('should return Case reference number search page', async () => {
            await request(app)
                .post('/case-reference-number-search')
                .send({ 'search-input': '56-181-2097' })
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
