import sinon from 'sinon';
import request from 'supertest';
import { app } from '../../../main/app';
import { expect } from 'chai';
import { LocationService } from '../../../main/service/LocationService';
import { PublicationService } from '../../../main/service/PublicationService';

const locationIdWithTelephoneAndEmail = 10;
const locationIdWithTelephoneOnly = 11;
const locationIdWithEmailOnly = 12;
const locationIdWithoutContact = 13;
const locationIdWithPublications = 14;
const locationIdWithNoListMessageOverride = 15;
const locationIdWithCautionMessageOverride = 16;
const locationIdWithHtmlMessageOverride = 17;

const courtStub = sinon.stub(LocationService.prototype, 'getLocationById');
courtStub
    .withArgs(locationIdWithTelephoneAndEmail)
    .resolves(JSON.parse('{"name":"New Court", "email": "test@test.com", "contactNo": "0123456789"}'));
courtStub.withArgs(locationIdWithTelephoneOnly).resolves(JSON.parse('{"name":"New Court", "contactNo": "0123456789"}'));
courtStub.withArgs(locationIdWithEmailOnly).resolves(JSON.parse('{"name":"New Court", "email": "test@test.com"}'));
courtStub.withArgs(locationIdWithoutContact).resolves(JSON.parse('{"name":"New Court"}'));
courtStub.withArgs(locationIdWithPublications).resolves(JSON.parse('{"name":"New Court"}'));
courtStub.withArgs(locationIdWithNoListMessageOverride).resolves(JSON.parse('{"name":"New Court"}'));
courtStub.withArgs(locationIdWithCautionMessageOverride).resolves(JSON.parse('{"name":"New Court"}'));
courtStub.withArgs(locationIdWithHtmlMessageOverride).resolves(JSON.parse('{"name":"New Court"}'));

const publicationStub = sinon.stub(PublicationService.prototype, 'getPublicationsByLocation');
publicationStub.withArgs(locationIdWithTelephoneAndEmail.toString()).resolves([]);
publicationStub.withArgs(locationIdWithTelephoneOnly.toString()).resolves([]);
publicationStub.withArgs(locationIdWithEmailOnly.toString()).resolves([]);
publicationStub.withArgs(locationIdWithoutContact.toString()).resolves([]);
publicationStub.withArgs(locationIdWithPublications.toString()).resolves([
    { artefactId: '1', listType: 'CIVIL_DAILY_CAUSE_LIST', contentDate: '2025-01-20T00:00:00Z', language: 'WELSH' },
    { artefactId: '2', listType: 'CIVIL_DAILY_CAUSE_LIST', contentDate: '2025-01-20T00:00:00Z', language: 'ENGLISH' },
    { artefactId: '3', listType: 'CST_WEEKLY_HEARING_LIST', contentDate: '2025-01-20T00:00:00Z', language: 'ENGLISH' },
    { artefactId: '4', listType: 'CIVIL_DAILY_CAUSE_LIST', contentDate: '2025-01-22T00:00:00Z', language: 'ENGLISH' },
    { artefactId: '5', listType: 'FAMILY_DAILY_CAUSE_LIST', contentDate: '2025-01-21T00:00:00Z', language: 'ENGLISH' },
    { artefactId: '6', listType: 'FAMILY_DAILY_CAUSE_LIST', contentDate: '2025-01-21T00:00:00Z', language: 'WELSH' },
    { artefactId: '7', listType: 'AST_DAILY_HEARING_LIST', contentDate: '2025-01-18T00:00:00Z', language: 'ENGLISH' },
    { artefactId: '8', listType: 'AST_DAILY_HEARING_LIST', contentDate: '2025-01-19T00:00:00Z', language: 'WELSH' },
]);
publicationStub.withArgs(locationIdWithNoListMessageOverride.toString()).resolves([]);
publicationStub.withArgs(locationIdWithCautionMessageOverride.toString()).resolves([
    { artefactId: '1', listType: 'CIVIL_DAILY_CAUSE_LIST', contentDate: '2025-01-20T00:00:00Z', language: 'ENGLISH' },
    { artefactId: '2', listType: 'CST_WEEKLY_HEARING_LIST', contentDate: '2025-01-20T00:00:00Z', language: 'ENGLISH' },
]);
publicationStub.withArgs(locationIdWithHtmlMessageOverride.toString()).resolves([]);

const locationMetadataResponse = {
    locationMetadataId: '123-456',
    locationId: 1,
    cautionMessage: 'English caution message',
    welshCautionMessage: 'Welsh caution message',
    noListMessage: 'English no list message',
    welshNoListMessage: 'Welsh no list message',
};

const htmlLocationMetadataResponse = {
    locationMetadataId: '123-456',
    locationId: 1,
    cautionMessage: '<strong>HTML caution message</strong>',
    welshCautionMessage: '<strong>HTML caution message</strong>',
    noListMessage: '<strong>HTML no list message</strong>',
    welshNoListMessage: '<strong>HTML no list message</strong>',
};

const additionalLocationInfoStub = sinon.stub(LocationService.prototype, 'getLocationMetadata');
additionalLocationInfoStub.withArgs(locationIdWithTelephoneAndEmail.toString()).returns(null);
additionalLocationInfoStub.withArgs(locationIdWithTelephoneOnly.toString()).returns(null);
additionalLocationInfoStub.withArgs(locationIdWithEmailOnly.toString()).returns(null);
additionalLocationInfoStub.withArgs(locationIdWithoutContact.toString()).returns(null);
additionalLocationInfoStub.withArgs(locationIdWithPublications.toString()).returns(null);
additionalLocationInfoStub.withArgs(locationIdWithNoListMessageOverride).returns(locationMetadataResponse);
additionalLocationInfoStub.withArgs(locationIdWithCautionMessageOverride).returns(locationMetadataResponse);
additionalLocationInfoStub.withArgs(locationIdWithHtmlMessageOverride).returns(htmlLocationMetadataResponse);

describe('Summary of publications page', () => {
    let htmlRes: Document;

    const bodyClass = 'govuk-body';

    beforeAll(async () => {
        app.request['user'] = { userId: '123-456', roles: 'SYSTEM_ADMIN' };
    });

    describe('with court telephone and email', () => {
        const PAGE_URL = `/summary-of-publications?locationId=${locationIdWithTelephoneAndEmail}`;
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
        const PAGE_URL = `/summary-of-publications?locationId=${locationIdWithTelephoneOnly}`;
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
        const PAGE_URL = `/summary-of-publications?locationId=${locationIdWithEmailOnly}`;
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
        const PAGE_URL = `/summary-of-publications?locationId=${locationIdWithTelephoneAndEmail}&lng=cy`;
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
        const PAGE_URL = `/summary-of-publications?locationId=${locationIdWithTelephoneOnly}&lng=cy`;
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
        const PAGE_URL = `/summary-of-publications?locationId=${locationIdWithEmailOnly}&lng=cy`;
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
        const PAGE_URL = `/summary-of-publications?locationId=${locationIdWithoutContact}`;
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
        const PAGE_URL = `/summary-of-publications?locationId=${locationIdWithCautionMessageOverride}`;
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
        const PAGE_URL = `/summary-of-publications?locationId=${locationIdWithCautionMessageOverride}&lng=cy`;
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
        const PAGE_URL = `/summary-of-publications?locationId=${locationIdWithNoListMessageOverride}`;
        beforeAll(async () => {
            await request(app)
                .get(PAGE_URL)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                });
        });

        it('should display caution message when no list is there in English', () => {
            const body = htmlRes.getElementsByClassName(bodyClass);
            expect(body[4].innerHTML).equals('English caution message');
        });

        it('should display no list for location message in English', () => {
            const body = htmlRes.getElementsByClassName(bodyClass);
            expect(body[5].innerHTML).equals('English no list message');
        });
    });

    describe('with no list for location message override in Welsh', () => {
        const PAGE_URL = `/summary-of-publications?locationId=${locationIdWithNoListMessageOverride}&lng=cy`;
        beforeAll(async () => {
            await request(app)
                .get(PAGE_URL)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                });
        });

        it('should display caution message when no list is there in Welsh', () => {
            const body = htmlRes.getElementsByClassName(bodyClass);
            expect(body[4].innerHTML).equals('Welsh caution message');
        });

        it('should display no list for location message in Welsh', () => {
            const body = htmlRes.getElementsByClassName(bodyClass);
            expect(body[5].innerHTML).equals('Welsh no list message');
        });
    });

    describe('with override message in HTML format', () => {
        const PAGE_URL = `/summary-of-publications?locationId=${locationIdWithHtmlMessageOverride}`;
        beforeAll(async () => {
            await request(app)
                .get(PAGE_URL)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                });
        });

        it('should display caution message as HTML', () => {
            const body = htmlRes.getElementsByClassName(bodyClass);
            expect(body[4].innerHTML).equals('<strong>HTML caution message</strong>');
        });

        it('should display no list message as HTML', () => {
            const body = htmlRes.getElementsByClassName(bodyClass);
            expect(body[5].innerHTML).equals('<strong>HTML no list message</strong>');
        });
    });

    describe('with publications', () => {
        const PAGE_URL = `/summary-of-publications?locationId=${locationIdWithPublications}`;
        beforeAll(async () => {
            await request(app)
                .get(PAGE_URL)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                });
        });

        it('should have correct page title', () => {
            const pageTitle = htmlRes.title;
            expect(pageTitle).contains(
                'What do you want to view from New Court? – Court and Tribunal Hearings – GOV.UK',
                'Could not find the page title'
            );
        });

        it('should display header', () => {
            const header = htmlRes.getElementsByClassName('govuk-heading-l');
            expect(header[0].innerHTML).contains(
                'What do you want to view from New Court?',
                'Could not find correct value in header'
            );
        });

        it('should display a back button with the correct value', () => {
            const backLink = htmlRes.getElementsByClassName('govuk-back-link');
            expect(backLink[0].innerHTML).contains('Back', 'Back button does not contain correct text');
            expect(backLink[0].getAttribute('href')).equal('#', 'Back value does not contain correct link');
        });

        it('should display publications', () => {
            const body = htmlRes.getElementsByClassName(bodyClass);
            expect(body[4].innerHTML).contains(
                'Select the list you want to view from the link(s) below:',
                'Select list text does not match'
            );
            expect(body[5].innerHTML).contains(
                'Asylum Support Tribunal Daily Hearing List 19 January 2025 - Welsh (Cymraeg)',
                'list type does not match'
            );

            expect(body[6].innerHTML).contains(
                'Asylum Support Tribunal Daily Hearing List 18 January 2025 - English (Saesneg)',
                'list type does not match'
            );

            expect(body[7].innerHTML).contains(
                'Care Standards Tribunal Weekly Hearing List for week commencing 20 January 2025 - English (Saesneg)',
                'list type does not match'
            );

            expect(body[8].innerHTML).contains(
                'Civil Daily Cause List 22 January 2025 - English (Saesneg)',
                'list type does not match'
            );

            expect(body[9].innerHTML).contains(
                'Civil Daily Cause List 20 January 2025 - English (Saesneg)',
                'list type does not match'
            );

            expect(body[10].innerHTML).contains(
                'Civil Daily Cause List 20 January 2025 - Welsh (Cymraeg)',
                'list type does not match'
            );

            expect(body[11].innerHTML).contains(
                'Family Daily Cause List 21 January 2025 - English (Saesneg)',
                'list type does not match'
            );

            expect(body[12].innerHTML).contains(
                'Family Daily Cause List 21 January 2025 - Welsh (Cymraeg)',
                'list type does not match'
            );
        });
    });
});
