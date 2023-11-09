import sinon from 'sinon';
import request from 'supertest';
import { app } from '../../../main/app';
import { expect } from 'chai';
import { LocationService } from '../../../main/service/locationService';
import { SummaryOfPublicationsService } from '../../../main/service/summaryOfPublicationsService';

const locationIdForCourtWithTelephoneAndEmail = 10;
const locationIdForCourtWithTelephoneOnly = 11;
const locationIdForCourtWithEmailOnly = 12;
const locationIdForCourtWithoutContact = 13;

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

sinon.stub(SummaryOfPublicationsService.prototype, 'getPublications').resolves([]);

describe('Summary of publications page', () => {
    let htmlRes: Document;

    const bodyClass = 'govuk-body';

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
    });
});
