import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../main/app';
import { request as expressRequest } from 'express';
import { PublicationService } from '../../main/service/PublicationService';
import sinon from 'sinon';

expressRequest['user'] = { roles: 'VERIFIED' };
const caseNumberStub = sinon.stub(PublicationService.prototype, 'getCaseByCaseNumber');
const subscriptionsCaseData = { caseName: 'name', caseNumber: '1234', caseUrn: '12345', partyNames: 'name1' };
caseNumberStub.returns(subscriptionsCaseData);

describe('Case reference number search result', () => {
    describe('on GET', () => {
        test('should return Case reference number search result', async () => {
            await request(app)
                .get('/case-reference-number-search-results?search-type=case-number&search-input=123456')
                .expect(res => {
                    expect(res.status).to.equal(200);
                    expect(res.text).to.contain('Subscription URN search results');
                });
        });
    });

    describe('on POST', () => {
        test('should redirect to pending subscription page', async () => {
            await request(app)
                .post('/case-reference-number-search-results')
                .send({})
                .expect(res => {
                    expect(res.status).to.equal(302);
                    expect(res.header['location']).to.contain('pending-subscriptions');
                });
        });

        test('should render error page if no body is provided', async () => {
            await request(app)
                .post('/case-reference-number-search-results')
                .expect(res => {
                    expect(res.status).to.equal(200);
                    expect(res.text).to.contain('Sorry, there is a problem');
                });
        });
    });
});
