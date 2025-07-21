import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../../../main/app';
import sinon from 'sinon';
import { LocationService } from '../../../../main/service/LocationService';
import { request as expressRequest } from 'express';

const PAGE_URL = '/location-metadata-manage?locationId=';
expressRequest['user'] = { roles: 'SYSTEM_ADMIN' };

const locationId = '123';
const locationIdWithoutMetadata = '124';
const locationIdWithFailedUpdateRequest = '125';
const locationIdWithFailedCreateRequest = '126';

sinon.stub(LocationService.prototype, 'getLocationById').resolves({ name: 'Location A' });

const getLocationMetadataStub = sinon.stub(LocationService.prototype, 'getLocationMetadata');
getLocationMetadataStub.withArgs(locationId).resolves({ locationMetadataId: 'ABC' });
getLocationMetadataStub.withArgs(locationIdWithoutMetadata).resolves(null);
getLocationMetadataStub.withArgs(locationIdWithFailedUpdateRequest).resolves({ locationMetadataId: 'ABD' });
getLocationMetadataStub.withArgs(locationIdWithFailedCreateRequest).resolves(null);

const updateLocationMetadataStub = sinon.stub(LocationService.prototype, 'updateLocationMetadata');
updateLocationMetadataStub.withArgs(locationId).resolves(true);
updateLocationMetadataStub.withArgs(locationIdWithFailedUpdateRequest).resolves(false);

const createLocationMetadataStub = sinon.stub(LocationService.prototype, 'addLocationMetadata').resolves(true);
createLocationMetadataStub.withArgs(locationIdWithoutMetadata).resolves(true);
createLocationMetadataStub.withArgs(locationIdWithFailedCreateRequest).resolves(false);

let htmlRes: Document;

describe('Location metadata manage page', () => {
    describe('location with existing metadata', () => {
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
            expect(pageTitle).equals('Manage location metadata', 'Page title does not match');
        });

        it('should have correct header', () => {
            const heading = htmlRes.getElementsByClassName('govuk-heading-l');
            expect(heading[0].innerHTML).contains('Manage location metadata for Location A', 'Header does not match');
        });

        it('should display correct labels', () => {
            const labels = htmlRes.getElementsByClassName('govuk-label');
            expect(labels.length).equals(4);
            expect(labels[0].innerHTML).contains('English caution message', 'Label does not match');
            expect(labels[1].innerHTML).contains('Welsh caution message', 'Label does not match');
            expect(labels[2].innerHTML).contains('English no list message', 'Label does not match');
            expect(labels[3].innerHTML).contains('Welsh no list message', 'Label does not match');
        });

        it('should display correct number of text areas', () => {
            const textAreas = htmlRes.getElementsByClassName('govuk-textarea');
            expect(textAreas.length).equals(4);
        });

        it('should have Update and Delete buttons', () => {
            const buttons = htmlRes.getElementsByClassName('govuk-button');
            expect(buttons.length).equals(2);
            expect(buttons[0].innerHTML).contains('Update', 'Update button does not match');
            expect(buttons[1].innerHTML).contains('Delete', 'Delete button does not match');
        });

        describe('with failed update request error', () => {
            beforeAll(async () => {
                await request(app)
                    .post(PAGE_URL + locationIdWithFailedUpdateRequest)
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
                expect(listItems[0].innerHTML).contains(
                    'Failed to update location metadata',
                    'Could not find error message'
                );
            });
        });
    });

    describe('location without metadata', () => {
        beforeAll(async () => {
            await request(app)
                .get(PAGE_URL + locationIdWithoutMetadata)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    htmlRes.getElementsByTagName('div')[0].remove();
                });
        });

        it('should have Create button', () => {
            const button = htmlRes.getElementsByClassName('govuk-button');
            expect(button.length).equals(1);
            expect(button[0].innerHTML).contains('Create', 'Create button does not match');
        });

        describe('with failed create request error', () => {
            beforeAll(async () => {
                await request(app)
                    .post(PAGE_URL + locationIdWithFailedCreateRequest)
                    .send({ 'english-caution-message': 'message 1' })
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
                expect(listItems[0].innerHTML).contains(
                    'Failed to create location metadata',
                    'Could not find error message'
                );
            });
        });
    });
});
