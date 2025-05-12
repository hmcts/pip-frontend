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
                'Admiralty Court (King’s Bench Division) Daily Cause List',
                'Business List (Chancery Division) Daily Cause List',
                'Chancery Appeals (Chancery Division) Daily Cause List',
                'Civil and Family Daily Cause List',
                'Civil Courts at the RCJ Daily Cause List',
                'Civil Daily Cause List',
                'Commercial Court (King’s Bench Division) Daily Cause List',
                'Companies Winding Up (Chancery Division) Daily Cause List',
                'Competition List (Chancery Division) Daily Cause List',
                'County Court at Central London Civil Daily Cause List',
                'Court of Appeal (Criminal Division) Daily Cause List',
                'Court of Protection Daily Cause List',
                'Financial List (Chancery Division/King’s Bench Division/Commercial Court) Daily Cause List',
                'Insolvency &amp; Companies Court (Chancery Division) Daily Cause List',
                'Intellectual Property (Chancery Division) Daily Cause List',
                'Intellectual Property and Enterprise Court Daily Cause List',
                'King’s Bench Division Daily Cause List',
                'King’s Bench Masters Daily Cause List',
                'London Administrative Court Daily Cause List',
                'London Circuit Commercial Court (King’s Bench Division) Daily Cause List',
                'Mayor &amp; City Civil Daily Cause List',
                'Patents Court (Chancery Division) Daily Cause List',
                'Pensions List (Chancery Division) Daily Cause List',
                'Planning Court Daily Cause List',
                'Property, Trusts and Probate List (Chancery Division) Daily Cause List',
                'Revenue List (Chancery Division) Daily Cause List',
                'Senior Courts Costs Office Daily Cause List',
                'Single Justice Procedure Press List (Full List)',
                'Single Justice Procedure Press List (New Cases)',
                'Single Justice Procedure Press Register',
                'Single Justice Procedure Public List (Full List)',
                'Single Justice Procedure Public List (New Cases)',
                'Technology and Construction Court (King’s Bench Division) Daily Cause List',
            ];

            const tableRows = htmlRes
                .getElementsByClassName('govuk-table__body')[0]
                .getElementsByClassName('govuk-table__row');

            expect(tableRows.length).to.equal(
                expectedRowTexts.length,
                `Expected ${expectedRowTexts.length} rows but found ${tableRows.length}`
            );

            expectedRowTexts.forEach((expectedText, index) => {
                expect(tableRows[index].innerHTML).to.include(
                    expectedText,
                    `Row ${index + 1} should contain "${expectedText}"`
                );
            });
        });

        it('should display expected subscription list type checkboxes', () => {
            const expectedCheckboxValues = [
                'ADMIRALTY_COURT_KB_DAILY_CAUSE_LIST',
                'BUSINESS_LIST_CHD_DAILY_CAUSE_LIST',
                'CHANCERY_APPEALS_CHD_DAILY_CAUSE_LIST',
                'CIVIL_AND_FAMILY_DAILY_CAUSE_LIST',
                'CIVIL_COURTS_RCJ_DAILY_CAUSE_LIST',
                'CIVIL_DAILY_CAUSE_LIST',
                'COMMERCIAL_COURT_KB_DAILY_CAUSE_LIST',
                'COMPANIES_WINDING_UP_CHD_DAILY_CAUSE_LIST',
                'COMPETITION_LIST_CHD_DAILY_CAUSE_LIST',
                'COUNTY_COURT_LONDON_CIVIL_DAILY_CAUSE_LIST',
                'COURT_OF_APPEAL_CRIMINAL_DAILY_CAUSE_LIST',
                'COP_DAILY_CAUSE_LIST',
                'FINANCIAL_LIST_CHD_KB_DAILY_CAUSE_LIST',
                'INSOLVENCY_AND_COMPANIES_COURT_CHD_DAILY_CAUSE_LIST',
                'INTELLECTUAL_PROPERTY_LIST_CHD_DAILY_CAUSE_LIST',
                'INTELLECTUAL_PROPERTY_AND_ENTERPRISE_COURT_DAILY_CAUSE_LIST',
                'KINGS_BENCH_DIVISION_DAILY_CAUSE_LIST',
                'KINGS_BENCH_MASTERS_DAILY_CAUSE_LIST',
                'LONDON_ADMINISTRATIVE_COURT_DAILY_CAUSE_LIST',
                'LONDON_CIRCUIT_COMMERCIAL_COURT_KB_DAILY_CAUSE_LIST',
                'MAYOR_AND_CITY_CIVIL_DAILY_CAUSE_LIST',
                'PATENTS_COURT_CHD_DAILY_CAUSE_LIST',
                'PENSIONS_LIST_CHD_DAILY_CAUSE_LIST',
                'PLANNING_COURT_DAILY_CAUSE_LIST',
                'PROPERTY_TRUSTS_PROBATE_LIST_CHD_DAILY_CAUSE_LIST',
                'REVENUE_LIST_CHD_DAILY_CAUSE_LIST',
                'SENIOR_COURTS_COSTS_OFFICE_DAILY_CAUSE_LIST',
                'SJP_PRESS_LIST',
                'SJP_DELTA_PRESS_LIST',
                'SJP_PRESS_REGISTER',
                'SJP_PUBLIC_LIST',
                'SJP_DELTA_PUBLIC_LIST',
                'TECHNOLOGY_AND_CONSTRUCTION_COURT_KB_DAILY_CAUSE_LIST',
            ];

            const checkboxes = htmlRes.getElementsByName('list-selections[]');

            expect(checkboxes.length).to.equal(
                expectedCheckboxValues.length,
                `Expected ${expectedCheckboxValues.length} checkboxes but found ${checkboxes.length}`
            );

            expectedCheckboxValues.forEach((expectedValue, index) => {
                const checkboxValue = checkboxes[index]['value'] || checkboxes[index].getAttribute('value');
                expect(checkboxValue).to.include(
                    expectedValue,
                    `Checkbox ${index + 1} should have value containing "${expectedValue}" but got "${checkboxValue}"`
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
            const expectedListNames = [
                'Select Admiralty Court (King’s Bench Division) Daily Cause List\nRhestr Achosion Dyddiol Llys y Morlys (Adran Mainc y Brenin)',
                'Select Business List (Chancery Division) Daily Cause List\nRhestr Achosion Dyddiol y Llys Busnes (Adran Siawnsri)',
                'Select Chancery Appeals (Chancery Division) Daily Cause List\nRhestr Achosion Dyddiol Apeliadau Siawnsri (Adran Siawnsri)',
                'Select Civil and Family Daily Cause List\nRhestr Achosion Dyddiol y Llys Sifil a Theulu',
                'Select Civil Courts at the RCJ Daily Cause List\nRhestr Achosion Dyddiol Llys Sifil yn y Llysoedd Barn Brenhinol',
                'Select Civil Daily Cause List\nRhestr Achosion Dyddiol y Llys Sifil',
                'Select Commercial Court (King’s Bench Division) Daily Cause List\nRhestr Achosion Dyddiol y Llys Masnach (Adran Mainc y Brenin)',
                'Select Companies Winding Up (Chancery Division) Daily Cause List\nRhestr Achosion Dyddiol Dirwyn Cwmnïau i Ben (Adran Siawnsri)',
                'Select Competition List (Chancery Division) Daily Cause List\nRhestr Achosion Dyddiol Cystadleuaeth (Adran Siawnsri)',
                'Select County Court at Central London Civil Daily Cause List\nRhestr Achosion Dyddiol Sifil yn y Llys Sirol yng Nghanol Llundain',
                'Select Court of Appeal (Criminal Division) Daily Cause List\nRhestr Achosion Dyddiol y Llys Apêl (Adran Troseddol)',
                'Select Court of Protection Daily Cause List\nRhestr Achosion Dyddiol y Llys Gwarchod',
                'Select Financial List (Chancery Division/King’s Bench Division/Commercial Court) Daily Cause List\nRhestr Achosion Dyddiol Ariannol (Adran Siawnsri /Adran Mainc y Brenin/Llys Masnach)',
                'Select Insolvency &amp; Companies Court (Chancery Division) Daily Cause List\nRhestr Achosion Dyddiol Llys Cwmnïau ac achosion Ansolfedd (Adran Siawnsri)',
                'Select Intellectual Property (Chancery Division) Daily Cause List\nRhestr Achosion Dyddiol Eiddo Deallusol (Adran Siawnsri)',
                'Select Intellectual Property and Enterprise Court Daily Cause List\nRhestr Achosion Dyddiol Llys Mentrau Eiddo Deallusol',
                'Select King’s Bench Division Daily Cause List\nRhestr Achosion Dyddiol Adran Mainc y Brenin',
                'Select King’s Bench Masters Daily Cause List\nRhestr Achosion Dyddiol Meistri Mainc y Brenin',
                'Select London Administrative Court Daily Cause List\nRhestr Achosion Dyddiol Llys Gweinyddol Llundain',
                'Select London Circuit Commercial Court (King’s Bench Division) Daily Cause List\nRhestr Achosion Dyddiol Llys Masnachol Cylchdaith Llundain (Adran Mainc y Brenin)',
                "Select Mayor &amp; City Civil Daily Cause List\nRhestr Achosion Dyddiol Llys Sifil y Maer a'r Ddinas",
                'Select Patents Court (Chancery Division) Daily Cause List\nRhestr Achosion Dyddiol Llys Patentau (Adran Siawnsri)',
                'Select Pensions List (Chancery Division) Daily Cause List\nRhestr Achosion Dyddiol Pensiynau (Adran Siawnsri)',
                'Select Planning Court Daily Cause List\nRhestr Achosion Dyddiol y Llys Cynllunio',
                'Select Property, Trusts and Probate List (Chancery Division) Daily Cause List\nRhestr Achosion Dyddiol Eiddo, Ymddiriedolaethau a Phrofiant (Adran Siawnsri)',
                'Select Revenue List (Chancery Division) Daily Cause List\nRhestr Achosion Dyddiol Refeniw (Adran Siawnsri)',
                'Select Senior Courts Costs Office Daily Cause List\nRhestr Achosion Dyddiol Swyddfa Costau’r Uwchlysoedd',
                'Select Single Justice Procedure Press List (Full List)\nRhestr y Wasg Y Weithdrefn Un Ynad (Rhestr Lawn)',
                'Select Single Justice Procedure Press List (New Cases)\nRhestr y Wasg Y Weithdrefn Un Ynad (Achosion Newydd)',
                'Select Single Justice Procedure Press Register\nCofrestr y Wasg Y Weithdrefn Un Ynad',
                'Select Single Justice Procedure Public List (Full List)\nRhestr Gyhoeddus Y Weithdrefn Un Ynad (Rhestr Lawn)',
                'Select Single Justice Procedure Public List (New Cases)\nRhestr Gyhoeddus Y Weithdrefn Un Ynad (Achosion Newydd)',
                'Select Technology and Construction Court (King’s Bench Division) Daily Cause List\nRhestr Achosion Dyddiol Llys Technoleg ac Adeiladu (Adran Mainc y Brenin)',
            ];

            const tableRows = htmlRes
                .getElementsByClassName('govuk-table__body')[0]
                .getElementsByClassName('govuk-table__row');

            expect(tableRows.length).equal(
                expectedListNames.length,
                'Number of table rows does not match expected count'
            );

            // Verify each row contains the expected text
            expectedListNames.forEach((expectedText, index) => {
                expect(tableRows[index].innerHTML).contains(
                    expectedText,
                    `Row ${index + 1} does not contain expected text`
                );
            });
        });

        it('should display expected subscription list type checkboxes', () => {
            const expectedCheckboxValues = [
                'ADMIRALTY_COURT_KB_DAILY_CAUSE_LIST',
                'BUSINESS_LIST_CHD_DAILY_CAUSE_LIST',
                'CHANCERY_APPEALS_CHD_DAILY_CAUSE_LIST',
                'CIVIL_AND_FAMILY_DAILY_CAUSE_LIST',
                'CIVIL_COURTS_RCJ_DAILY_CAUSE_LIST',
                'CIVIL_DAILY_CAUSE_LIST',
                'COMMERCIAL_COURT_KB_DAILY_CAUSE_LIST',
                'COMPANIES_WINDING_UP_CHD_DAILY_CAUSE_LIST',
                'COMPETITION_LIST_CHD_DAILY_CAUSE_LIST',
                'COUNTY_COURT_LONDON_CIVIL_DAILY_CAUSE_LIST',
                'COURT_OF_APPEAL_CRIMINAL_DAILY_CAUSE_LIST',
                'COP_DAILY_CAUSE_LIST',
                'FINANCIAL_LIST_CHD_KB_DAILY_CAUSE_LIST',
                'INSOLVENCY_AND_COMPANIES_COURT_CHD_DAILY_CAUSE_LIST',
                'INTELLECTUAL_PROPERTY_LIST_CHD_DAILY_CAUSE_LIST',
                'INTELLECTUAL_PROPERTY_AND_ENTERPRISE_COURT_DAILY_CAUSE_LIST',
                'KINGS_BENCH_DIVISION_DAILY_CAUSE_LIST',
                'KINGS_BENCH_MASTERS_DAILY_CAUSE_LIST',
                'LONDON_ADMINISTRATIVE_COURT_DAILY_CAUSE_LIST',
                'LONDON_CIRCUIT_COMMERCIAL_COURT_KB_DAILY_CAUSE_LIST',
                'MAYOR_AND_CITY_CIVIL_DAILY_CAUSE_LIST',
                'PATENTS_COURT_CHD_DAILY_CAUSE_LIST',
                'PENSIONS_LIST_CHD_DAILY_CAUSE_LIST',
                'PLANNING_COURT_DAILY_CAUSE_LIST',
                'PROPERTY_TRUSTS_PROBATE_LIST_CHD_DAILY_CAUSE_LIST',
                'REVENUE_LIST_CHD_DAILY_CAUSE_LIST',
                'SENIOR_COURTS_COSTS_OFFICE_DAILY_CAUSE_LIST',
                'SJP_PRESS_LIST',
                'SJP_DELTA_PRESS_LIST',
                'SJP_PRESS_REGISTER',
                'SJP_PUBLIC_LIST',
                'SJP_DELTA_PUBLIC_LIST',
                'TECHNOLOGY_AND_CONSTRUCTION_COURT_KB_DAILY_CAUSE_LIST',
            ];

            const checkboxes = htmlRes.getElementsByName('list-selections[]');

            expect(checkboxes.length).equal(
                expectedCheckboxValues.length,
                `Expected ${expectedCheckboxValues.length} checkboxes but found ${checkboxes.length}`
            );

            expectedCheckboxValues.forEach((expectedValue, index) => {
                expect(checkboxes[index]['value']).contains(
                    expectedValue,
                    `Checkbox ${index + 1} should have value containing "${expectedValue}"`
                );
            });
        });
    });
});
