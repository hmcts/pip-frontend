import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../main/app';
import { request as expressRequest } from 'express';
import { PublicationService } from '../../main/service/PublicationService';
import sinon from 'sinon';

expressRequest['user'] = { roles: 'VERIFIED', userId: 1 };

const publicationServiceStub = sinon.stub(PublicationService.prototype, 'getCasesByCaseName');
publicationServiceStub.returns([{}]);

describe('Case name search', () => {
    describe('on GET', () => {
        test('should return case name search page', async () => {
            await request(app)
                .get('/case-name-search')
                .expect(res => {
                    expect(res.status).to.equal(200);
                    expect(res.text).to.contain('What is the name of the case?');
                });
        });

        test('should return case name search page with errors', async () => {
            await request(app)
                .get('/case-name-search?error=true')
                .expect(res => {
                    expect(res.status).to.equal(200);
                    expect(res.text).to.contain('What is the name of the case');
                });
        });
    });

    describe('on POST', () => {
        test('should return case name search page with error when case name is invalid', async () => {
            await request(app)
                .post('/case-name-search')
                .send({ 'case-name': 'a' })
                .expect(res => {
                    expect(res.status).to.equal(200);
                    expect(res.text).to.contain('What is the name of the case');
                });
        });

        test('should return case name search results page when case name is valid', async () => {
            await request(app)
                .post('/case-name-search')
                .send({ 'case-name': 'abcd' })
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.header['location']).contains('case-name-search-results?');
                });
        });
    });
});
