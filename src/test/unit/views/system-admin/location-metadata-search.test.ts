import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../../../main/app';
import sinon from 'sinon';
import { LocationService } from '../../../../main/service/LocationService';
import { request as expressRequest } from 'express';

const PAGE_URL = '/location-metadata-search';
expressRequest['user'] = { roles: 'SYSTEM_ADMIN' };

sinon.stub(LocationService.prototype, 'getLocationById').resolves([{ name: 'Location A' }, { name: 'Location B' }]);
const getLocationByNameStub = sinon.stub(LocationService.prototype, 'getLocationByName').resolves('success');

getLocationByNameStub.withArgs('Location A').resolves('success');
getLocationByNameStub.withArgs('Location C').resolves(null);

let htmlRes: Document;

describe('Location metadata search page', () => {
    beforeAll(async () => {
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                htmlRes.getElementsByTagName('div')[0].remove();
            });
    });

    it('should have correct page title', () => {
        const pageTitle = htmlRes.title;
        expect(pageTitle).equals('Search for location metadata by court or tribunal name', 'Page title does not match');
    });

    it('should have correct header', () => {
        const heading = htmlRes.getElementsByClassName('govuk-heading-l');
        expect(heading[0].innerHTML).contains('Find the location metadata to manage', 'Header does not match');
    });

    it('should display back button', () => {
        const backButton = htmlRes.getElementsByClassName('govuk-back-link')[0];
        expect(backButton.innerHTML).contains('Back', 'Back button does not match');
    });

    it('should display search label', () => {
        const label = htmlRes.getElementsByClassName('govuk-label');
        expect(label[0].innerHTML).contains('Search by court or tribunal name', 'label does not match');
    });

    it('should have continue button', () => {
        const button = htmlRes.getElementsByClassName('govuk-button');
        expect(button[0].innerHTML).contains('Continue', 'Continue button does not match');
    });

    describe('with no results error', () => {
        beforeAll(async () => {
            await request(app)
                .post(PAGE_URL)
                .send({ 'input-autocomplete': 'Location C' })
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    htmlRes.getElementsByTagName('div')[0].remove();
                });
        });

        it('should display error title', () => {
            const errorTitle = htmlRes.getElementsByClassName('govuk-error-summary__title');
            expect(errorTitle[0].innerHTML).contains('There is a problem', 'Error title does not match');
        });

        it('should display error message', () => {
            const errorSummary = htmlRes.getElementsByClassName('govuk-error-summary__body');
            expect(errorSummary[0].innerHTML).contains('There are no matching results', 'Error message does not match');
        });
    });

    describe('with no input error', () => {
        beforeAll(async () => {
            await request(app)
                .post(PAGE_URL)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    htmlRes.getElementsByTagName('div')[0].remove();
                });
        });

        it('should display error title', () => {
            const errorTitle = htmlRes.getElementsByClassName('govuk-error-summary__title');
            expect(errorTitle[0].innerHTML).contains('There is a problem', 'Error title does not match');
        });

        it('should display error message', () => {
            const errorSummary = htmlRes.getElementsByClassName('govuk-error-summary__body');
            expect(errorSummary[0].innerHTML).contains(
                'Court or tribunal name must be 3 characters or more',
                'Error message does not match'
            );
        });
    });
});
