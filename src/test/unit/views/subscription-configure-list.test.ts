import { app } from '../../../main/app';
import request from 'supertest';
import { SubscriptionRequests } from '../../../main/resources/requests/subscriptionRequests';
import sinon from 'sinon';
import fs from 'fs';
import path from 'path';
import { LocationService } from '../../../main/service/locationService';
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
            expect(pageTitle).contains('Select List Types', 'Page title does not match');
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
                "Configure the lists you will receive for your selected courts and tribunals. This will not affect any specific cases you may have subscribed to. Also don't forget to come back regularly to see new list types as we add more.",
                'Page first description text does not exist'
            );
            expect(pageBodyText[1].innerHTML).contains(
                'If you un-select all hearing lists on this screen we will revert your subscriptions to default and you will receive all list types. If you want to stop receiving all lists or stop receiving lists from a particular court/tribunal please remove the subscriptions on the previous screen.',
                'Page second description text does not exist'
            );
        });

        it('should contain filter component', () => {
            const filterTitle = htmlRes.getElementsByClassName('govuk-heading-m');
            expect(filterTitle[0].innerHTML).contains('Filter', 'Filter title does not exist');
        });

        it('should contain selected filter component', () => {
            const filterTitle = htmlRes.getElementsByClassName('govuk-heading-m');
            expect(filterTitle[1].innerHTML).contains('Selected filter', 'Selected filter title does not exist');
        });

        it('should contain apply filters button', () => {
            const applyFiltersButton = htmlRes.getElementsByClassName('govuk-button');
            expect(applyFiltersButton[0].innerHTML).contains('Apply filters', 'Apply filters button does not exist');
        });

        it('should contain clear filters button', () => {
            const applyFiltersButton = htmlRes.querySelector('.moj-filter__heading-action .govuk-link');
            expect(applyFiltersButton.innerHTML).contains('Clear filters', 'Clear filters button does not exist');
        });

        it('should contain jurisdiction filter', () => {
            const jurisdictionLegend = htmlRes.getElementsByTagName('legend');
            expect(jurisdictionLegend[0].innerHTML).contains(
                'Type of court or tribunal',
                "Type of court or tribunal filter doesn't exist"
            );
        });

        it('should contain expected jurisdiction checkboxes', () => {
            const checkboxes = htmlRes.getElementsByName('Jurisdiction');
            expect(checkboxes.length).equal(3, 'Could not find jurisdiction checkboxes');
            expect(checkboxes[0]['value']).contains('Civil', 'Could not find civil checkbox');
            expect(checkboxes[1]['value']).contains('Family', 'Could not find Family checkbox');
            expect(checkboxes[2]['value']).contains('Magistrates', 'Could not find Magistrates checkbox');
        });

        it('should contain a back to top link, that links back up to the top', () => {
            const backToTopButton = htmlRes.getElementById('back-to-top-button');
            expect(backToTopButton.innerHTML).contains('Back to top', 'Back to top button does not exist');
            expect(backToTopButton.getAttribute('href')).contains('#');
        });

        it('should contain continue button', () => {
            const continueButton = htmlRes.getElementsByClassName('govuk-button');
            expect(continueButton[3].innerHTML).contains('Continue', 'Continue button does not exist');
        });

        it('should contain your selections component', () => {
            const selectionsTitle = htmlRes.getElementsByClassName('govuk-heading-m');
            expect(selectionsTitle[2].innerHTML).contains('Your selection(s)', 'Your selections title does not exist');
        });

        it('should contain selections counter', () => {
            const selectionText = htmlRes.getElementsByClassName('govuk-body');
            const counter = htmlRes.getElementById('selectionCount');
            expect(selectionText[2].innerHTML).contains('selected', 'Selection text does not exist');
            expect(counter.innerHTML).contains(0, 'Could not find counter value');
        });

        it('should contain letters that navigate to other sections of the page', () => {
            const alphabeticalLetters = htmlRes.getElementsByClassName('two-rows-alphabet');
            const letterA = htmlRes.getElementById('A-selector');
            expect(letterA.innerHTML).contains('A', 'Alphabetical link is not present');
            expect(alphabeticalLetters.length).equal(26, 'Could not find alphabet letters');
        });

        it('should contain list type rows', () => {
            const elementsCount = 7;
            const tableRows = htmlRes
                .getElementsByClassName('govuk-table__body')[0]
                .getElementsByClassName('govuk-table__row');
            expect(tableRows.length).equal(elementsCount, 'Could not find all table rows');
            expect(tableRows[0].innerHTML).contains('Civil and Family Daily Cause List');
            expect(tableRows[1].innerHTML).contains('Civil Daily Cause List');
            expect(tableRows[2].innerHTML).contains('Court of Protection Daily Cause List');
            expect(tableRows[3].innerHTML).contains('Single Justice Procedure Press List (Full List)');
            expect(tableRows[4].innerHTML).contains('Single Justice Procedure Press List (New Cases)');
            expect(tableRows[5].innerHTML).contains('Single Justice Procedure Press Register');
            expect(tableRows[6].innerHTML).contains('Single Justice Procedure Public List');
        });

        it('should display expected subscription list type checkboxes', () => {
            const checkboxes = htmlRes.getElementsByName('list-selections[]');
            expect(checkboxes.length).equal(7, 'Could not find all row checkboxes');
            expect(checkboxes[0]['value']).contains(
                'CIVIL_AND_FAMILY_DAILY_CAUSE_LIST',
                'Could not find mixed list checkbox'
            );
            expect(checkboxes[1]['value']).contains('CIVIL_DAILY_CAUSE_LIST', 'Could not find civil list checkbox');
            expect(checkboxes[2]['value']).contains('COP_DAILY_CAUSE_LIST', 'Could not find COP list checkbox');
            expect(checkboxes[3]['value']).contains('SJP_PRESS_LIST', 'Could not find SJP press list checkbox');
            expect(checkboxes[4]['value']).contains(
                'SJP_DELTA_PRESS_LIST',
                'Could not find SJP delta press list checkbox'
            );
            expect(checkboxes[5]['value']).contains('SJP_PRESS_REGISTER', 'Could not find SJP press register checkbox');
            expect(checkboxes[6]['value']).contains('SJP_PUBLIC_LIST', 'Could not find SJP public list checkbox');
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

        it('should contain expected jurisdiction checkboxes', () => {
            const checkboxes = htmlRes.getElementsByName('Jurisdiction');
            expect(checkboxes.length).equal(3, 'Could not find jurisdiction checkboxes');
            expect(checkboxes[0]['value']).contains('Llys Sifil', 'Could not find civil checkbox');
            expect(checkboxes[1]['value']).contains('Llys Teulu', 'Could not find Family checkbox');
            expect(checkboxes[2]['value']).contains('Llys Ynadon', 'Could not find Magistrates checkbox');
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
            expect(tableRows[1].innerHTML).contains('Civil Daily Cause List\nRhestr Achosion Dyddiol y Llys Sifil');
            expect(tableRows[2].innerHTML).contains(
                'Court of Protection Daily Cause List\nRhestr Achosion Dyddiol y Llys Gwarchod'
            );
            expect(tableRows[3].innerHTML).contains(
                'Single Justice Procedure Press List (Full List)\nRhestr y Wasg Y Weithdrefn Un Ynad (Rhestr Lawn)'
            );
            expect(tableRows[4].innerHTML).contains(
                'Single Justice Procedure Press List (New Cases)\nRhestr y Wasg Y Weithdrefn Un Ynad (Achosion Newydd)'
            );
            expect(tableRows[5].innerHTML).contains(
                'Single Justice Procedure Press Register\nCofrestr y Wasg Y Weithdrefn Un Ynad'
            );
            expect(tableRows[6].innerHTML).contains(
                'Single Justice Procedure Public List\nRhestr Gyhoeddus Y Weithdrefn Un Ynad'
            );
        });

        it('should display expected subscription list type checkboxes', () => {
            const checkboxes = htmlRes.getElementsByName('list-selections[]');
            expect(checkboxes.length).equal(7, 'Could not find all row checkboxes');
            expect(checkboxes[0]['value']).contains(
                'CIVIL_AND_FAMILY_DAILY_CAUSE_LIST',
                'Could not find mixed list checkbox'
            );
            expect(checkboxes[1]['value']).contains('CIVIL_DAILY_CAUSE_LIST', 'Could not find civil list checkbox');
            expect(checkboxes[2]['value']).contains('COP_DAILY_CAUSE_LIST', 'Could not find COP list checkbox');
            expect(checkboxes[3]['value']).contains('SJP_PRESS_LIST', 'Could not find SJP press list checkbox');
            expect(checkboxes[4]['value']).contains(
                'SJP_DELTA_PRESS_LIST',
                'Could not find SJP delta press list checkbox'
            );
            expect(checkboxes[5]['value']).contains('SJP_PRESS_REGISTER', 'Could not find SJP press register checkbox');
            expect(checkboxes[6]['value']).contains('SJP_PUBLIC_LIST', 'Could not find SJP public list checkbox');
        });
    });
});
