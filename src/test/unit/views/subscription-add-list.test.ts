import { app } from '../../../main/app';
import request from 'supertest';
import sinon from 'sinon';
import fs from 'fs';
import path from 'path';
import { expect } from 'chai';
import { SubscriptionService } from '../../../main/service/SubscriptionService';

const PAGE_URL = '/subscription-add-list';
const pageHeader = 'govuk-heading-l';

let htmlRes: Document;

const stubGetSubscriptions = sinon.stub(SubscriptionService.prototype, 'generateListTypeForCourts');

describe('Subscription Add List Type to court subscription', () => {
    const listTypeData = fs.readFileSync(
        path.resolve(__dirname, '../../../test/unit/mocks/listTypeSubscriptions/listTypes.json'),
        'utf-8'
    );
    const listTypes = JSON.parse(listTypeData);

    describe('in English', () => {
        stubGetSubscriptions.withArgs('PI_AAD', 'en', '1').returns(listTypes);
        beforeAll(async () => {
            app.request['user'] = {
                userId: '1',
                roles: 'VERIFIED',
                userProvenance: 'PI_AAD',
            };

            await request(app)
                .get(PAGE_URL)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    htmlRes.getElementsByTagName('div')[0].remove();
                });
        });

        it('should have correct page title', () => {
            const pageTitle = htmlRes.title;
            expect(pageTitle).contains(
                'Add email subscription - Select list types - Court and Tribunal Hearings - GOV.UK',
                'Page title does not match'
            );
        });

        it('should display a back button with the correct value', () => {
            const backLink = htmlRes.getElementsByClassName('govuk-back-link');
            expect(backLink[0].innerHTML).contains('Back', 'Back button does not contain correct text');
            expect(backLink[0].getAttribute('href')).equal('#', 'Back value does not contain correct link');
        });

        it('should display the header', () => {
            const header = htmlRes.getElementsByClassName(pageHeader);
            expect(header[0].innerHTML).contains('Select List Types', 'Could not find the header');
        });

        it('should contain body text', () => {
            const pageBodyText = htmlRes.getElementsByClassName('govuk-body');
            expect(pageBodyText[0].innerHTML).contains(
                "Choose the lists you will receive for your selected courts and tribunals. This will not affect any specific cases you may have subscribed to. Also don't forget to come back regularly to see new list types as we add more.",
                'Page first description text does not exist'
            );
        });

        it('should contain a back to top link, that links back up to the top', () => {
            const backToTopButton = htmlRes.getElementById('back-to-top-button');
            expect(backToTopButton.innerHTML).contains('Back to top', 'Back to top button does not exist');
            expect(backToTopButton.getAttribute('href')).contains('#');
        });

        it('should contain continue button', () => {
            const continueButton = htmlRes.getElementsByClassName('govuk-button');
            expect(continueButton[0].innerHTML).contains('Continue', 'Continue button does not exist');
        });

        it('should contain selections counter', () => {
            const selectionText = htmlRes.getElementsByClassName('govuk-body');
            const counter = htmlRes.getElementById('selectionCount');
            expect(selectionText[1].innerHTML).contains('selected', 'Selection text does not exist');
            expect(counter.innerHTML).contains(0, 'Could not find counter value');
        });

        it('should contain list type rows', () => {
            const elementsCount = 7;
            const tableRows = htmlRes
                .getElementsByClassName('govuk-table__body')[0]
                .getElementsByClassName('govuk-table__row');
            expect(tableRows.length).equal(elementsCount, 'Could not find all table rows');
            expect(tableRows[0].innerHTML).contains('Civil and Family Daily Cause List');
            expect(tableRows[1].innerHTML).contains('Family Daily Cause List');
            expect(tableRows[2].innerHTML).contains('Single Justice Procedure Press List (Full List)');
            expect(tableRows[3].innerHTML).contains('Single Justice Procedure Press List (New Cases)');
            expect(tableRows[4].innerHTML).contains('Single Justice Procedure Press Register');
            expect(tableRows[5].innerHTML).contains('Single Justice Procedure Public List (Full List)');
            expect(tableRows[6].innerHTML).contains('Single Justice Procedure Public List (New Cases)');
        });

        it('should display expected subscription list type checkboxes', () => {
            const checkboxes = htmlRes.getElementsByName('list-selections[]');
            expect(checkboxes.length).equal(7, 'Could not find all row checkboxes');
            expect(checkboxes[0]['value']).contains(
                'CIVIL_AND_FAMILY_DAILY_CAUSE_LIST',
                'Could not find mixed list checkbox'
            );
            expect(checkboxes[1]['value']).contains('FAMILY_DAILY_CAUSE_LIST', 'Could not find civil list checkbox');
            expect(checkboxes[2]['value']).contains('SJP_PRESS_LIST', 'Could not find SJP press list checkbox');
            expect(checkboxes[3]['value']).contains(
                'SJP_DELTA_PRESS_LIST',
                'Could not find SJP delta press list checkbox'
            );
            expect(checkboxes[4]['value']).contains('SJP_PRESS_REGISTER', 'Could not find SJP press register checkbox');
            expect(checkboxes[5]['value']).contains('SJP_PUBLIC_LIST', 'Could not find SJP public list checkbox');
            expect(checkboxes[6]['value']).contains(
                'SJP_DELTA_PUBLIC_LIST',
                'Could not find SJP delta public list checkbox'
            );
        });
    });

    describe('in Welsh', () => {
        stubGetSubscriptions.withArgs('PI_AAD', 'cy', '1').returns(listTypes);
        beforeAll(async () => {
            app.request['user'] = {
                userId: '1',
                roles: 'VERIFIED',
                userProvenance: 'PI_AAD',
            };

            await request(app)
                .get(`${PAGE_URL}?lng=cy`)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    htmlRes.getElementsByTagName('div')[0].remove();
                });
        });

        it('should contain list type rows', () => {
            const elementsCount = 7;
            const tableRows = htmlRes
                .getElementsByClassName('govuk-table__body')[0]
                .getElementsByClassName('govuk-table__row');
            expect(tableRows.length).equal(elementsCount, 'Could not find all table rows');
            expect(tableRows[0].innerHTML).contains(
                'Select Civil and Family Daily Cause List\nRhestr Achosion Dyddiol y Llys Sifil a Theulu'
            );
            expect(tableRows[1].innerHTML).contains('Family Daily Cause List\nRhestr Achosion Dyddiol y Llys Teulu');
        });

        it('should display expected subscription list type checkboxes', () => {
            const checkboxes = htmlRes.getElementsByName('list-selections[]');
            expect(checkboxes.length).equal(7, 'Could not find all row checkboxes');
            expect(checkboxes[0]['value']).contains(
                'CIVIL_AND_FAMILY_DAILY_CAUSE_LIST',
                'Could not find mixed list checkbox'
            );
            expect(checkboxes[1]['value']).contains('FAMILY_DAILY_CAUSE_LIST', 'Could not find civil list checkbox');
            expect(checkboxes[2]['value']).contains('SJP_PRESS_LIST', 'Could not find SJP press list checkbox');
            expect(checkboxes[3]['value']).contains(
                'SJP_DELTA_PRESS_LIST',
                'Could not find SJP delta press list checkbox'
            );
            expect(checkboxes[4]['value']).contains('SJP_PRESS_REGISTER', 'Could not find SJP press register checkbox');
            expect(checkboxes[5]['value']).contains('SJP_PUBLIC_LIST', 'Could not find SJP public list checkbox');
            expect(checkboxes[6]['value']).contains(
                'SJP_DELTA_PUBLIC_LIST',
                'Could not find SJP delta public list checkbox'
            );
        });
    });
});
