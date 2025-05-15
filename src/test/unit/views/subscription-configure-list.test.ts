import { app } from '../../../main/app';
import request from 'supertest';
import { SubscriptionRequests } from '../../../main/resources/requests/SubscriptionRequests';
import sinon from 'sinon';
import fs from 'fs';
import path from 'path';
import { LocationService } from '../../../main/service/LocationService';
import { expect } from 'chai';

const PAGE_URL = '/subscription-configure-list';
const pageHeader = 'govuk-heading-l';

let htmlRes: Document;

const stubGetSubscriptions = sinon.stub(SubscriptionRequests.prototype, 'getUserSubscriptions');

describe('Subscription Configure List', () => {
    const subscriptionData = fs.readFileSync(
        path.resolve(__dirname, '../../../test/unit/mocks/listTypeSubscriptions/listTypeSubscriptions.json'),
        'utf-8'
    );
    const returnedSubscriptions = JSON.parse(subscriptionData);

    stubGetSubscriptions.withArgs('1').returns(returnedSubscriptions.data);

    const locationStub = sinon.stub(LocationService.prototype, 'getLocationById');
    locationStub.withArgs(1).resolves({ jurisdiction: ['Civil', 'Crime'] });
    locationStub.withArgs(9).resolves({ jurisdiction: ['Magistrates'] });

    describe('in English', () => {
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
                'Edit list types - Select list types - Court and Tribunal Hearings - GOV.UK',
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

        it('should contain your selections component', () => {
            const selectionsTitle = htmlRes.getElementsByClassName('govuk-heading-m');
            expect(selectionsTitle[0].innerHTML).contains('Total selected', 'Your selections title does not exist');
        });

        it('should contain selections counter', () => {
            const selectionText = htmlRes.getElementsByClassName('govuk-body');
            const counter = htmlRes.getElementById('selectionCount');
            expect(selectionText[1].innerHTML).contains('selected', 'Selection text does not exist');
            expect(counter.innerHTML).contains(0, 'Could not find counter value');
        });

        it('should contain list type rows', () => {
            const expectedRowTexts = [
                'Birmingham Administrative Court Daily Cause List',
                'Bristol and Cardiff Administrative Court Daily Cause List',
                'Civil and Family Daily Cause List',
                'Civil Daily Cause List',
                'Court of Protection Daily Cause List',
                'Leeds Administrative Court Daily Cause List',
                'Manchester Administrative Court Daily Cause List',
                'Single Justice Procedure Press List (Full List)',
                'Single Justice Procedure Press List (New Cases)',
                'Single Justice Procedure Press Register',
                'Single Justice Procedure Public List (Full List)',
                'Single Justice Procedure Public List (New Cases)'
            ];

            const tableRows = htmlRes
                .getElementsByClassName('govuk-table__body')[0]
                .getElementsByClassName('govuk-table__row');

            expect(tableRows.length).equal(
                expectedRowTexts.length,
                `Expected ${expectedRowTexts.length} rows but found ${tableRows.length}`
            );

            expectedRowTexts.forEach((expectedText, index) => {
                expect(tableRows[index].innerHTML).contains(
                    expectedText,
                    `Row ${index + 1} should contain '${expectedText}'`
                );
            });
        });

        it('should display expected subscription list type checkboxes', () => {
            const expectedCheckboxValues = [
                'BIRMINGHAM_ADMINISTRATIVE_COURT_DAILY_CAUSE_LIST',
                'BRISTOL_AND_CARDIFF_ADMINISTRATIVE_COURT_DAILY_CAUSE_LIST',
                'CIVIL_AND_FAMILY_DAILY_CAUSE_LIST',
                'CIVIL_DAILY_CAUSE_LIST',
                'COP_DAILY_CAUSE_LIST',
                'LEEDS_ADMINISTRATIVE_COURT_DAILY_CAUSE_LIST',
                'MANCHESTER_ADMINISTRATIVE_COURT_DAILY_CAUSE_LIST',
                'SJP_PRESS_LIST',
                'SJP_DELTA_PRESS_LIST',
                'SJP_PRESS_REGISTER',
                'SJP_PUBLIC_LIST',
                'SJP_DELTA_PUBLIC_LIST'
            ];

            const checkboxes = htmlRes.getElementsByName('list-selections[]');
            expect(checkboxes.length).equal(expectedCheckboxValues.length,
                `Expected ${expectedCheckboxValues.length} checkboxes but found ${checkboxes.length}`);

            expectedCheckboxValues.forEach((expectedValue, index) => {
                expect(checkboxes[index]['value']).contains(
                    expectedValue,
                    `Checkbox at index ${index} should contain '${expectedValue}'`
                );
            });
        });
    });

    describe('in Welsh', () => {
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
            const expectedRows = [
                'Select Birmingham Administrative Court Daily Cause List\nRhestr Achosion Dyddiol Llys Gweinyddol Birmingham',
                'Bristol and Cardiff Administrative Court Daily Cause List\nRhestr Achosion Dyddiol Llys Gweinyddol Bryste a Chaerdydd',
                'Civil and Family Daily Cause List\nRhestr Achosion Dyddiol y Llys Sifil a Theulu',
                'Civil Daily Cause List\nRhestr Achosion Dyddiol y Llys Sifil',
                'Court of Protection Daily Cause List\nRhestr Achosion Dyddiol y Llys Gwarchod',
                'Leeds Administrative Court Daily Cause List\nRhestr Achosion Dyddiol Llys Gweinyddol Leeds',
                'Manchester Administrative Court Daily Cause List\nRhestr Achosion Dyddiol Llys Gweinyddol Manceinion',
                'Single Justice Procedure Press List (Full List)\nRhestr y Wasg Y Weithdrefn Un Ynad (Rhestr Lawn)',
                'Single Justice Procedure Press List (New Cases)\nRhestr y Wasg Y Weithdrefn Un Ynad (Achosion Newydd)',
                'Single Justice Procedure Press Register\nCofrestr y Wasg Y Weithdrefn Un Ynad',
                'Single Justice Procedure Public List (Full List)\nRhestr Gyhoeddus Y Weithdrefn Un Ynad (Rhestr Lawn)',
                'Single Justice Procedure Public List (New Cases)\nRhestr Gyhoeddus Y Weithdrefn Un Ynad (Achosion Newydd)'
            ];

            const tableRows = htmlRes
                .getElementsByClassName('govuk-table__body')[0]
                .getElementsByClassName('govuk-table__row');

            expect(tableRows.length).equal(expectedRows.length, 'Incorrect number of table rows');

            expectedRows.forEach((expectedContent, index) => {
                expect(tableRows[index].innerHTML).contains(
                    expectedContent,
                    `Could not find expected content in row ${index + 1}`
                );
            });
        });

        it('should display expected subscription list type checkboxes', () => {
            const expectedValues = [
                'BIRMINGHAM_ADMINISTRATIVE_COURT_DAILY_CAUSE_LIST',
                'BRISTOL_AND_CARDIFF_ADMINISTRATIVE_COURT_DAILY_CAUSE_LIST',
                'CIVIL_AND_FAMILY_DAILY_CAUSE_LIST',
                'CIVIL_DAILY_CAUSE_LIST',
                'COP_DAILY_CAUSE_LIST',
                'LEEDS_ADMINISTRATIVE_COURT_DAILY_CAUSE_LIST',
                'MANCHESTER_ADMINISTRATIVE_COURT_DAILY_CAUSE_LIST',
                'SJP_PRESS_LIST',
                'SJP_DELTA_PRESS_LIST',
                'SJP_PRESS_REGISTER',
                'SJP_PUBLIC_LIST',
                'SJP_DELTA_PUBLIC_LIST'
            ];

            const checkboxes = htmlRes.getElementsByName('list-selections[]');
            expect(checkboxes.length).equal(expectedValues.length, 'Incorrect number of checkboxes');

            expectedValues.forEach((expectedValue, index) => {
                expect(checkboxes[index]['value']).contains(
                    expectedValue,
                    `Could not find list checkbox for ${expectedValue}`
                );
            });
        });
    });
});
