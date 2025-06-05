import sinon from 'sinon';
import request from 'supertest';
import { app } from '../../../main/app';
import { expect } from 'chai';
import { LocationService } from '../../../main/service/LocationService';
import { SummaryOfPublicationsService } from '../../../main/service/SummaryOfPublicationsService';

const locationIdForCourtWithTelephoneAndEmail = 10;
const locationIdForCourtWithTelephoneOnly = 11;
const locationIdForCourtWithEmailOnly = 12;
const locationIdForCourtWithoutContact = 13;
const locationIdForCourtWithPublications = 14;
const locationIdForCourtWithNoListMessageOverride = 15;
const locationIdForCourtWithCautionMessageOverride = 16;

const courtStub = sinon.stub(LocationService.prototype, 'getLocationById');
courtStub
    .withArgs(locationIdForCourtWithTelephoneAndEmail)
    .resolves(JSON.parse('{"name":"New Court", "email": "test@test.com", "contactNo": "0123456789"}'));
courtStub
    .withArgs(locationIdForCourtWithTelephoneOnly)
    .resolves(JSON.parse('{"name":"New Court", "contactNo": "0123456789"}'));
courtStub
    .withArgs(locationIdForCourtWithEmailOnly)
    .resolves(JSON.parse('{"name":"New Court", "email": "test@test.com"}'));
courtStub.withArgs(locationIdForCourtWithoutContact).resolves(JSON.parse('{"name":"New Court"}'));
courtStub.withArgs(locationIdForCourtWithPublications).resolves(JSON.parse('{"name":"New Court"}'));
courtStub.withArgs(locationIdForCourtWithNoListMessageOverride).resolves(JSON.parse('{"name":"New Court"}'));
courtStub.withArgs(locationIdForCourtWithCautionMessageOverride).resolves(JSON.parse('{"name":"New Court"}'));

const publicationStub = sinon.stub(SummaryOfPublicationsService.prototype, 'getPublications');
publicationStub.withArgs(locationIdForCourtWithTelephoneAndEmail).resolves([]);
publicationStub.withArgs(locationIdForCourtWithTelephoneOnly).resolves([]);
publicationStub.withArgs(locationIdForCourtWithEmailOnly).resolves([]);
publicationStub.withArgs(locationIdForCourtWithoutContact).resolves([]);
publicationStub.withArgs(locationIdForCourtWithPublications).resolves([
    { artefactId: '1', listType: 'CIVIL_DAILY_CAUSE_LIST', contentDate: '2025-01-20T00:00:00Z', language: 'ENGLISH' },
    { artefactId: '2', listType: 'CST_WEEKLY_HEARING_LIST', contentDate: '2025-01-20T00:00:00Z', language: 'ENGLISH' },
]);
publicationStub.withArgs(locationIdForCourtWithNoListMessageOverride).resolves([]);
publicationStub.withArgs(locationIdForCourtWithCautionMessageOverride).resolves([
    { artefactId: '1', listType: 'CIVIL_DAILY_CAUSE_LIST', contentDate: '2025-01-20T00:00:00Z', language: 'ENGLISH' },
    { artefactId: '2', listType: 'CST_WEEKLY_HEARING_LIST', contentDate: '2025-01-20T00:00:00Z', language: 'ENGLISH' },
]);

const locationMetadataResponse = {
    locationMetadataId: '123-456',
    locationId: 1,
    cautionMessage: 'English caution message',
    welshCautionMessage: 'Welsh caution message',
    noListMessage: 'English no list message',
    welshNoListMessage: 'Welsh no list message',
};

const additionalLocationInfoStub = sinon.stub(LocationService.prototype, 'getLocationMetadata');
additionalLocationInfoStub.withArgs(locationIdForCourtWithTelephoneAndEmail.toString()).returns(null);
additionalLocationInfoStub.withArgs(locationIdForCourtWithTelephoneOnly.toString()).returns(null);
additionalLocationInfoStub.withArgs(locationIdForCourtWithEmailOnly.toString()).returns(null);
additionalLocationInfoStub.withArgs(locationIdForCourtWithoutContact.toString()).returns(null);
additionalLocationInfoStub.withArgs(locationIdForCourtWithPublications.toString()).returns(null);
additionalLocationInfoStub
    .withArgs(locationIdForCourtWithNoListMessageOverride, '123-456')
    .returns(locationMetadataResponse);
additionalLocationInfoStub
    .withArgs(locationIdForCourtWithCautionMessageOverride, '123-456')
    .returns(locationMetadataResponse);

describe('Summary of publications page', () => {
    let htmlRes: Document;

    const bodyClass = 'govuk-body';

    beforeAll(async () => {
        app.request['user'] = { userId: '123-456', roles: 'SYSTEM_ADMIN' };
    });

    describe('Summary of pubs', () => {
        describe('with court telephone and email', () => {
            const PAGE_URL = `/summary-of-publications?locationId=${locationIdForCourtWithTelephoneAndEmail}`;
            beforeAll(async () => {
                await request(app)
                    .get(PAGE_URL)
                    .then(res => {
                        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    });
            });

            it('should display the telephone and email message', () => {
                const body = htmlRes.getElementsByClassName(bodyClass);
                expect(body[4].innerHTML).contains(
                    'Sorry, lists for New Court are temporarily not available. Please contact the court/tribunal direct on 0123456789 or test@test.com for more information.',
                    'Telephone and email message is not displayed'
                );
            });
        });

        describe('with court telephone only', () => {
            const PAGE_URL = `/summary-of-publications?locationId=${locationIdForCourtWithTelephoneOnly}`;
            beforeAll(async () => {
                await request(app)
                    .get(PAGE_URL)
                    .then(res => {
                        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    });
            });

            it('should display the telephone only message', () => {
                const body = htmlRes.getElementsByClassName(bodyClass);
                expect(body[4].innerHTML).contains(
                    'Sorry, lists for New Court are temporarily not available. Please contact the court/tribunal direct on 0123456789 for more information.',
                    'Telephone only message is not displayed'
                );
            });
        });

        describe('with court email only', () => {
            const PAGE_URL = `/summary-of-publications?locationId=${locationIdForCourtWithEmailOnly}`;
            beforeAll(async () => {
                await request(app)
                    .get(PAGE_URL)
                    .then(res => {
                        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    });
            });

            it('should display the email only message', () => {
                const body = htmlRes.getElementsByClassName(bodyClass);
                expect(body[4].innerHTML).contains(
                    'Sorry, lists for New Court are temporarily not available. Please contact the court/tribunal direct on test@test.com for more information.',
                    'Email only message is not displayed'
                );
            });
        });

        describe('with court telephone and email in Welsh', () => {
            const PAGE_URL = `/summary-of-publications?locationId=${locationIdForCourtWithTelephoneAndEmail}&lng=cy`;
            beforeAll(async () => {
                await request(app)
                    .get(PAGE_URL)
                    .then(res => {
                        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    });
            });

            it('should display telephone and email in welsh', () => {
                const body = htmlRes.getElementsByClassName(bodyClass);
                expect(body[4].innerHTML).contains(
                    "Mae’n ddrwg gennym, nid yw’r rhestrau ar gyfer New Court ar gael ar hyn o bryd. Cysylltwch â'r llys/tribiwnlys yn uniongyrchol ar 0123456789 neu test@test.com am ragor o wybodaeth.",
                    'Telephone and email in Welsh is not displayed'
                );
            });
        });

        describe('with court telephone only in Welsh', () => {
            const PAGE_URL = `/summary-of-publications?locationId=${locationIdForCourtWithTelephoneOnly}&lng=cy`;
            beforeAll(async () => {
                await request(app)
                    .get(PAGE_URL)
                    .then(res => {
                        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    });
            });

            it('should display the telephone only message in welsh', () => {
                const body = htmlRes.getElementsByClassName(bodyClass);
                expect(body[4].innerHTML).contains(
                    "Mae’n ddrwg gennym, nid yw’r rhestrau ar gyfer New Court ar gael ar hyn o bryd. Cysylltwch â'r llys/tribiwnlys yn uniongyrchol ar 0123456789 am ragor o wybodaeth.",
                    'Telephone only message in Welsh is not displayed'
                );
            });
        });

        describe('with court email only in Welsh', () => {
            const PAGE_URL = `/summary-of-publications?locationId=${locationIdForCourtWithEmailOnly}&lng=cy`;
            beforeAll(async () => {
                await request(app)
                    .get(PAGE_URL)
                    .then(res => {
                        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    });
            });

            it('should display the email only message in welsh', () => {
                const body = htmlRes.getElementsByClassName(bodyClass);
                expect(body[4].innerHTML).contains(
                    "Mae’n ddrwg gennym, nid yw’r rhestrau ar gyfer New Court ar gael ar hyn o bryd. Cysylltwch â'r llys/tribiwnlys yn uniongyrchol ar test@test.com am ragor o wybodaeth.",
                    'Email only message in Welsh is not displayed'
                );
            });
        });

        describe('with no court contact information', () => {
            const PAGE_URL = `/summary-of-publications?locationId=${locationIdForCourtWithoutContact}`;
            beforeAll(async () => {
                await request(app)
                    .get(PAGE_URL)
                    .then(res => {
                        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    });
            });

            it('should display no contact information', () => {
                const body = htmlRes.getElementsByClassName(bodyClass);
                expect(body[4].innerHTML).contains(
                    'Sorry, no lists found for this court',
                    'Contact information is displayed'
                );
            });
        });

        describe('with caution message in English', () => {
            const PAGE_URL = `/summary-of-publications?locationId=${locationIdForCourtWithCautionMessageOverride}`;
            beforeAll(async () => {
                await request(app)
                    .get(PAGE_URL)
                    .then(res => {
                        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    });
            });

            it('should display caution message in English', () => {
                const body = htmlRes.getElementsByClassName(bodyClass);
                expect(body[4].innerHTML).equals('English caution message');
            });
        });

        describe('with caution message in Welsh', () => {
            const PAGE_URL = `/summary-of-publications?locationId=${locationIdForCourtWithCautionMessageOverride}&lng=cy`;
            beforeAll(async () => {
                await request(app)
                    .get(PAGE_URL)
                    .then(res => {
                        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    });
            });

            it('should display caution message in Welsh', () => {
                const body = htmlRes.getElementsByClassName(bodyClass);
                expect(body[4].innerHTML).equals('Welsh caution message');
            });
        });

        describe('with no list for location message override in English', () => {
            const PAGE_URL = `/summary-of-publications?locationId=${locationIdForCourtWithNoListMessageOverride}`;
            beforeAll(async () => {
                await request(app)
                    .get(PAGE_URL)
                    .then(res => {
                        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    });
            });

            it('should display no list for location message in English', () => {
                const body = htmlRes.getElementsByClassName(bodyClass);
                expect(body[4].innerHTML).equals('English no list message');
            });
        });

        describe('with no list for location message override in Welsh', () => {
            const PAGE_URL = `/summary-of-publications?locationId=${locationIdForCourtWithNoListMessageOverride}&lng=cy`;
            beforeAll(async () => {
                await request(app)
                    .get(PAGE_URL)
                    .then(res => {
                        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    });
            });

            it('should display no list for location message in Welsh', () => {
                const body = htmlRes.getElementsByClassName(bodyClass);
                expect(body[4].innerHTML).equals('Welsh no list message');
            });
        });

        describe('with publications', () => {
            const PAGE_URL = `/summary-of-publications?locationId=${locationIdForCourtWithPublications}`;
            beforeAll(async () => {
                await request(app)
                    .get(PAGE_URL)
                    .then(res => {
                        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    });
            });

            it('should display publications', () => {
                const body = htmlRes.getElementsByClassName(bodyClass);
                expect(body[4].innerHTML).contains(
                    'Select the list you want to view from the link(s) below:',
                    'Select list text does not match'
                );

                expect(body[5].innerHTML).contains(
                    'Civil Daily Cause List 20 January 2025 - English (Saesneg)',
                    'Daily list link text does not match'
                );

                expect(body[6].innerHTML).contains(
                    'Care Standards Tribunal Weekly Hearing List for week commencing 20 January 2025 - English (Saesneg)',
                    'Weekly list link text does not match'
                );
            });
        });
    });
});
