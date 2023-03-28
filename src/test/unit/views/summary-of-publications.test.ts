import sinon from 'sinon';
import request from 'supertest';
import { app } from '../../../main/app';
import { expect } from 'chai';
import { LocationService } from '../../../main/service/locationService';

const courtStub = sinon.stub(LocationService.prototype, 'getLocationById');
courtStub.withArgs(8).resolves(JSON.parse('{"name":"New Court", "email": "test@test.com", "contactNo": "0123456789"}'));
courtStub.withArgs(10).resolves(JSON.parse('{"name":"New Court"}'));

describe('Summary of publications page', () => {
    let htmlRes: Document;

    const bodyClass = 'govuk-body';

    describe('SJP Summary of Pubs', () => {
        const PAGE_URL = '/summary-of-publications?locationId=9';

        beforeAll(async () => {
            await request(app)
                .get(PAGE_URL)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                });
        });

        it('should display the custom SJP message', () => {
            const body = htmlRes.getElementsByClassName(bodyClass);
            expect(body[4].innerHTML).contains(
                'Sorry, the Single Justice Procedure public court lists are temporarily not available. Please contact the Courts and Tribunals Service Centre on 0300 303 0656 for more information.',
                'SJP message is not displayed'
            );
        });
    });

    describe('Non SJP Summary of Pubs with court contact information', () => {
        const PAGE_URL = '/summary-of-publications?locationId=8';
        beforeAll(async () => {
            await request(app)
                .get(PAGE_URL)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                });
        });

        it('should display the non SJP message', () => {
            const body = htmlRes.getElementsByClassName(bodyClass);
            expect(body[4].innerHTML).contains(
                'Sorry, lists for New Court are temporarily not available. Please contact the court/tribunal direct on 0123456789 or test@test.com for more information.',
                'Non SJP is not displayed'
            );
        });
    });

    describe('Non SJP Summary of Pubs with no court contact information', () => {
        const PAGE_URL = '/summary-of-publications?locationId=10';
        beforeAll(async () => {
            await request(app)
                .get(PAGE_URL)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                });
        });

        it('should display the non SJP message', () => {
            const body = htmlRes.getElementsByClassName(bodyClass);
            expect(body[4].innerHTML).contains('Sorry, no lists found for this court', 'Non SJP is not displayed');
        });
    });
});
