import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../../../main/app';
import sinon from 'sinon';
import { LocationService } from '../../../../main/service/LocationService';
import { request as expressRequest } from 'express';

const PAGE_URL = '/location-metadata-delete-confirmation?locationId=';
expressRequest['user'] = { roles: 'SYSTEM_ADMIN' };

const locationId = '123';
const locationIdWithFailedRequest = '124';

sinon.stub(LocationService.prototype, 'getLocationById').resolves({ name: 'Location A' });
const getLocationMetadataStub = sinon.stub(LocationService.prototype, 'getLocationMetadata');
const deleteLocationMetadataStub = sinon.stub(LocationService.prototype, 'deleteLocationMetadata');

getLocationMetadataStub.withArgs(locationId).resolves({ locationMetadataId: '456' });
getLocationMetadataStub.withArgs(locationIdWithFailedRequest).resolves({ locationMetadataId: '457' });

deleteLocationMetadataStub.withArgs('456').resolves(true);
deleteLocationMetadataStub.withArgs('457').resolves(false);

let htmlRes: Document;

describe('Location metadata delete confirmation page', () => {
    beforeAll(async () => {
        await request(app)
            .get(PAGE_URL + locationId)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                htmlRes.getElementsByTagName('div')[0].remove();
            });
    });

    it('should have correct page title', () => {
        const pageTitle = htmlRes.title;
        expect(pageTitle).equals('Delete location metadata confirmation', 'Page title does not match');
    });

    it('should have correct header', () => {
        const heading = htmlRes.getElementsByClassName('govuk-heading-l');
        expect(heading[0].innerHTML).contains(
            'Are you sure you want to delete location metadata for Location A?',
            'Header does not match'
        );
    });

    it('should display back button', () => {
        const backButton = htmlRes.getElementsByClassName('govuk-back-link')[0];
        expect(backButton.innerHTML).contains('Back', 'Back button does not match');
    });

    it('should display yes radio option', () => {
        const radioButton = htmlRes.getElementsByClassName('govuk-radios__input');
        expect(radioButton[0].outerHTML).contains('yes', 'Radio button does not match');
    });

    it('should display no radio option', () => {
        const radioButton = htmlRes.getElementsByClassName('govuk-radios__input');
        expect(radioButton[1].outerHTML).contains('no', 'Radio button does not match');
    });

    it('should have continue button', () => {
        const button = htmlRes.getElementsByClassName('govuk-button');
        expect(button[0].innerHTML).contains('Continue', 'Continue button does not match');
    });

    describe('with no selection error', () => {
        beforeAll(async () => {
            await request(app)
                .post(PAGE_URL + locationId)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                });
        });

        it('should display error summary title', () => {
            const dialog = htmlRes.getElementsByClassName('govuk-error-summary');
            expect(dialog[0].getElementsByClassName('govuk-error-summary__title')[0].innerHTML).contains(
                'There is a problem',
                'Could not find error summary title'
            );
        });

        it('should display error messages in the summary', () => {
            const list = htmlRes.getElementsByClassName(' govuk-error-summary__list')[0];
            const listItems = list.getElementsByTagName('a');
            expect(listItems[0].innerHTML).contains('An option must be selected', 'Could not find error');
        });
    });

    describe('with failed request error', () => {
        beforeAll(async () => {
            await request(app)
                .post(PAGE_URL + locationIdWithFailedRequest)
                .send({ 'delete-location-metadata-confirm': 'yes' })
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    htmlRes.getElementsByTagName('div')[0].remove();
                });
        });

        it('should display error summary title', () => {
            const dialog = htmlRes.getElementsByClassName('govuk-error-summary');
            expect(dialog[0].getElementsByClassName('govuk-error-summary__title')[0].innerHTML).contains(
                'There is a problem',
                'Could not find error summary title'
            );
        });

        it('should display error messages in the summary', () => {
            const list = htmlRes.getElementsByClassName(' govuk-error-summary__list')[0];
            const listItems = list.getElementsByTagName('a');
            expect(listItems[0].innerHTML).contains('Failed to delete location metadata', 'Could not find error');
        });
    });
});
