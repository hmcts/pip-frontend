import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';
import { app } from '../../main/app';
import { request as expressRequest } from 'express';
import { PublicationService } from '../../main/service/publicationService';

expressRequest['user'] = { roles: 'VERIFIED' };

const publicationStub = sinon.stub(PublicationService.prototype, 'getCasesByPartyName');
publicationStub.withArgs('party name').resolves([{ result: '123' }]);
publicationStub.withArgs('party name 2').resolves([]);

describe('Party name search', () => {
    describe('on GET', () => {
        test('should return party name search page', async () => {
            await request(app)
                .get('/party-name-search')
                .expect(res => expect(res.status).to.equal(200));
        });
    });

    describe('on POST', () => {
        test('should redirect to party name search results page', async () => {
            await request(app)
                .post('/party-name-search')
                .send({ 'party-name': 'party name' })
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.header['location']).to.equal('party-name-search-results?search=party%20name');
                });
        });

        test('should return party name search page if no result', async () => {
            await request(app)
                .post('/party-name-search')
                .send({ 'party-name': 'party name 2' })
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
