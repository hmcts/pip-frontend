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
    locationStub.withArgs(1).resolves({
        jurisdictionType: ['Civil Court', 'Court of Appeal (Criminal Division)', 'High Court', 'Magistrates Court'],
    });
    locationStub.withArgs(9).resolves({ jurisdictionType: ['Magistrates Court'] });

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
            const elementsCount = 27;
            const tableRows = htmlRes
                .getElementsByClassName('govuk-table__body')[0]
                .getElementsByClassName('govuk-table__row');
            expect(tableRows.length).equal(elementsCount, 'Could not find all table rows');
            expect(tableRows[0].innerHTML).contains('Civil and Family Daily Cause List');
            expect(tableRows[1].innerHTML).contains('Civil Courts at the RCJ Daily Cause List');
            expect(tableRows[2].innerHTML).contains('Civil Daily Cause List');
            expect(tableRows[3].innerHTML).contains('County Court at Central London Civil Daily Cause List');
            expect(tableRows[4].innerHTML).contains('Court of Appeal (Criminal Division) Daily Cause List');
            expect(tableRows[5].innerHTML).contains('Family Division of the High Court Daily Cause List');
            expect(tableRows[6].innerHTML).contains('Intellectual Property (Chancery Division) Daily Cause List');
            expect(tableRows[7].innerHTML).contains('Intellectual Property and Enterprise Court Daily Cause List');
            expect(tableRows[8].innerHTML).contains('King’s Bench Division Daily Cause List');
            expect(tableRows[9].innerHTML).contains('King’s Bench Masters Daily Cause List');
            expect(tableRows[10].innerHTML).contains('London Administrative Court Daily Cause List');
            expect(tableRows[11].innerHTML).contains(
                'London Circuit Commercial Court (King’s Bench Division) Daily Cause List'
            );
            expect(tableRows[12].innerHTML).contains('Magistrates Public List');
            expect(tableRows[13].innerHTML).contains('Magistrates Standard List');
            expect(tableRows[14].innerHTML).contains('Mayor &amp; City Civil Daily Cause List');
            expect(tableRows[15].innerHTML).contains('Patents Court (Chancery Division) Daily Cause List');
            expect(tableRows[16].innerHTML).contains('Pensions List (Chancery Division) Daily Cause List');
            expect(tableRows[17].innerHTML).contains('Planning Court Daily Cause List');
            expect(tableRows[18].innerHTML).contains(
                'Property, Trusts and Probate List (Chancery Division) Daily Cause List'
            );
            expect(tableRows[19].innerHTML).contains('Revenue List (Chancery Division) Daily Cause List');
            expect(tableRows[20].innerHTML).contains('Senior Courts Costs Office Daily Cause List');
            expect(tableRows[21].innerHTML).contains('Single Justice Procedure Press List (Full List)');
            expect(tableRows[22].innerHTML).contains('Single Justice Procedure Press List (New Cases)');
            expect(tableRows[23].innerHTML).contains('Single Justice Procedure Press Register');
            expect(tableRows[24].innerHTML).contains('Single Justice Procedure Public List (Full List)');
            expect(tableRows[25].innerHTML).contains('Single Justice Procedure Public List (New Cases)');
            expect(tableRows[26].innerHTML).contains(
                'Technology and Construction Court (King’s Bench Division) Daily Cause List'
            );
        });

        it('should display expected subscription list type checkboxes', () => {
            const checkboxes = htmlRes.getElementsByName('list-selections[]');
            expect(checkboxes.length).equal(27, 'Could not find all row checkboxes');
            expect(checkboxes[0]['value']).contains(
                'CIVIL_AND_FAMILY_DAILY_CAUSE_LIST',
                'Could not find mixed list checkbox'
            );
            expect(checkboxes[2]['value']).contains('CIVIL_DAILY_CAUSE_LIST', 'Could not find civil list checkbox');
            expect(checkboxes[3]['value']).contains(
                'COUNTY_COURT_LONDON_CIVIL_DAILY_CAUSE_LIST',
                'Could not find county court london list checkbox'
            );
            expect(checkboxes[4]['value']).contains(
                'COURT_OF_APPEAL_CRIMINAL_DAILY_CAUSE_LIST',
                'Could not find court of appeal criminal division list checkbox'
            );
            expect(checkboxes[5]['value']).contains('FAMILY_DIVISION_HIGH_COURT_DAILY_CAUSE_LIST',
                'Could not find Family division high court list checkbox');
            expect(checkboxes[6]['value']).contains(
                'INTELLECTUAL_PROPERTY_LIST_CHD_DAILY_CAUSE_LIST',
                'Could not find Rolls Building list checkbox'
            );
            expect(checkboxes[7]['value']).contains(
                'INTELLECTUAL_PROPERTY_AND_ENTERPRISE_COURT_DAILY_CAUSE_LIST',
                'Could not find Rolls Building list checkbox'
            );
            expect(checkboxes[8]['value']).contains(
                'KINGS_BENCH_DIVISION_DAILY_CAUSE_LIST',
                "Could not find king's bench division list checkbox"
            );
            expect(checkboxes[9]['value']).contains(
                'KINGS_BENCH_MASTERS_DAILY_CAUSE_LIST',
                "Could not find king's bench masters list checkbox"
            );
            expect(checkboxes[10]['value']).contains(
                'LONDON_ADMINISTRATIVE_COURT_DAILY_CAUSE_LIST',
                'Could not find london admin court list checkbox'
            );
            expect(checkboxes[11]['value']).contains(
                'LONDON_CIRCUIT_COMMERCIAL_COURT_KB_DAILY_CAUSE_LIST',
                'Could not find Rolls Building list checkbox'
            );
            expect(checkboxes[12]['value']).contains(
                'MAGISTRATES_PUBLIC_LIST',
                'Could not find magistrate public list checkbox'
            );
            expect(checkboxes[13]['value']).contains(
                'MAGISTRATES_STANDARD_LIST',
                'Could not find magistrate standard list checkbox'
            );
            expect(checkboxes[14]['value']).contains(
                'MAYOR_AND_CITY_CIVIL_DAILY_CAUSE_LIST',
                'Could not find mayor and city list checkbox'
            );
            expect(checkboxes[15]['value']).contains(
                'PATENTS_COURT_CHD_DAILY_CAUSE_LIST',
                'Could not find Rolls Building list checkbox'
            );
            expect(checkboxes[16]['value']).contains(
                'PENSIONS_LIST_CHD_DAILY_CAUSE_LIST',
                'Could not find Rolls Building list checkbox'
            );
            expect(checkboxes[17]['value']).contains(
                'PLANNING_COURT_DAILY_CAUSE_LIST',
                'Could not find planning court list checkbox'
            );
            expect(checkboxes[18]['value']).contains(
                'PROPERTY_TRUSTS_PROBATE_LIST_CHD_DAILY_CAUSE_LIST',
                'Could not find Rolls Building list checkbox'
            );
            expect(checkboxes[19]['value']).contains(
                'REVENUE_LIST_CHD_DAILY_CAUSE_LIST',
                'Could not find Rolls Building list checkbox'
            );
            expect(checkboxes[20]['value']).contains(
                'SENIOR_COURTS_COSTS_OFFICE_DAILY_CAUSE_LIST',
                'Could not find senior courts costs office list checkbox'
            );
            expect(checkboxes[21]['value']).contains('SJP_PRESS_LIST', 'Could not find SJP press list checkbox');
            expect(checkboxes[22]['value']).contains(
                'SJP_DELTA_PRESS_LIST',
                'Could not find SJP delta press list checkbox'
            );
            expect(checkboxes[23]['value']).contains(
                'SJP_PRESS_REGISTER',
                'Could not find SJP press register checkbox'
            );
            expect(checkboxes[24]['value']).contains('SJP_PUBLIC_LIST', 'Could not find SJP public list checkbox');
            expect(checkboxes[25]['value']).contains(
                'SJP_DELTA_PUBLIC_LIST',
                'Could not find SJP delta public list checkbox'
            );
            expect(checkboxes[26]['value']).contains(
                'TECHNOLOGY_AND_CONSTRUCTION_COURT_KB_DAILY_CAUSE_LIST',
                'Could not find Rolls Building list checkbox'
            );
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
            const elementsCount = 27;
            const tableRows = htmlRes
                .getElementsByClassName('govuk-table__body')[0]
                .getElementsByClassName('govuk-table__row');
            expect(tableRows.length).equal(elementsCount, 'Could not find all table rows');
            expect(tableRows[0].innerHTML).contains(
                'Select Civil and Family Daily Cause List\nRhestr Achosion Dyddiol y Llys Sifil a Theulu'
            );
            expect(tableRows[1].innerHTML).contains(
                'Civil Courts at the RCJ Daily Cause List\nRhestr Achosion Dyddiol Llys Sifil yn y Llysoedd Barn Brenhinol'
            );
            expect(tableRows[2].innerHTML).contains('Civil Daily Cause List\nRhestr Achosion Dyddiol y Llys Sifil');
            expect(tableRows[3].innerHTML).contains(
                'County Court at Central London Civil Daily Cause List\nRhestr Achosion Dyddiol Sifil yn y Llys Sirol yng Nghanol Llundain'
            );
            expect(tableRows[4].innerHTML).contains(
                'Court of Appeal (Criminal Division) Daily Cause List\nRhestr Achosion Dyddiol y Llys Apêl (Adran Troseddol)'
            );
            expect(tableRows[5].innerHTML).contains(
                'Family Division of the High Court Daily Cause List\nRhestr Achosion Dyddiol Adran Deulu yr Uchel Lys'
            );
            expect(tableRows[6].innerHTML).contains(
                'Intellectual Property (Chancery Division) Daily Cause List\nRhestr Achosion Dyddiol Eiddo Deallusol (Adran Siawnsri)'
            );
            expect(tableRows[7].innerHTML).contains(
                'Intellectual Property and Enterprise Court Daily Cause List\nRhestr Achosion Dyddiol Llys Mentrau Eiddo Deallusol'
            );
            expect(tableRows[8].innerHTML).contains(
                'King’s Bench Division Daily Cause List\nRhestr Achosion Dyddiol Adran Mainc y Brenin'
            );
            expect(tableRows[9].innerHTML).contains(
                'King’s Bench Masters Daily Cause List\nRhestr Achosion Dyddiol Meistri Mainc y Brenin'
            );
            expect(tableRows[10].innerHTML).contains(
                'London Administrative Court Daily Cause List\nRhestr Achosion Dyddiol Llys Gweinyddol Llundain'
            );
            expect(tableRows[11].innerHTML).contains(
                'London Circuit Commercial Court (King’s Bench Division) Daily Cause List\nRhestr Achosion Dyddiol Llys Masnachol Cylchdaith Llundain (Adran Mainc y Brenin)'
            );
            expect(tableRows[12].innerHTML).contains(
                "Magistrates Public List\nRhestr Gyhoeddus y Llys Ynadon"
            );
            expect(tableRows[13].innerHTML).contains(
                "Magistrates Standard List\nRhestr Safonol y Llys Ynadon"
            );
            expect(tableRows[14].innerHTML).contains(
                "Mayor &amp; City Civil Daily Cause List\nRhestr Achosion Dyddiol Llys Sifil y Maer a'r Ddinas"
            );
            expect(tableRows[15].innerHTML).contains(
                'Patents Court (Chancery Division) Daily Cause List\nRhestr Achosion Dyddiol Llys Patentau (Adran Siawnsri)'
            );
            expect(tableRows[16].innerHTML).contains(
                'Pensions List (Chancery Division) Daily Cause List\nRhestr Achosion Dyddiol Pensiynau (Adran Siawnsri)'
            );
            expect(tableRows[17].innerHTML).contains(
                'Planning Court Daily Cause List\nRhestr Achosion Dyddiol y Llys Cynllunio'
            );
            expect(tableRows[18].innerHTML).contains(
                'Property, Trusts and Probate List (Chancery Division) Daily Cause List\nRhestr Achosion Dyddiol Eiddo, Ymddiriedolaethau a Phrofiant (Adran Siawnsri)'
            );
            expect(tableRows[19].innerHTML).contains(
                'Revenue List (Chancery Division) Daily Cause List\nRhestr Achosion Dyddiol Refeniw (Adran Siawnsri)'
            );
            expect(tableRows[20].innerHTML).contains(
                'Senior Courts Costs Office Daily Cause List\nRhestr Achosion Dyddiol Swyddfa Costau’r Uwchlysoedd'
            );
            expect(tableRows[21].innerHTML).contains(
                'Single Justice Procedure Press List (Full List)\nRhestr y Wasg Y Weithdrefn Un Ynad (Rhestr Lawn)'
            );
            expect(tableRows[22].innerHTML).contains(
                'Single Justice Procedure Press List (New Cases)\nRhestr y Wasg Y Weithdrefn Un Ynad (Achosion Newydd)'
            );
            expect(tableRows[23].innerHTML).contains(
                'Single Justice Procedure Press Register\nCofrestr y Wasg Y Weithdrefn Un Ynad'
            );
            expect(tableRows[24].innerHTML).contains(
                'Single Justice Procedure Public List (Full List)\nRhestr Gyhoeddus Y Weithdrefn Un Ynad (Rhestr Lawn)'
            );

            expect(tableRows[25].innerHTML).contains(
                'Single Justice Procedure Public List (New Cases)\nRhestr Gyhoeddus Y Weithdrefn Un Ynad (Achosion Newydd)'
            );
            expect(tableRows[26].innerHTML).contains(
                'Technology and Construction Court (King’s Bench Division) Daily Cause List\nRhestr Achosion Dyddiol Llys Technoleg ac Adeiladu (Adran Mainc y Brenin)'
            );
        });

        it('should display expected subscription list type checkboxes', () => {
            const checkboxes = htmlRes.getElementsByName('list-selections[]');
            expect(checkboxes[0]['value']).contains(
                'CIVIL_AND_FAMILY_DAILY_CAUSE_LIST',
                'Could not find mixed list checkbox'
            );
            expect(checkboxes[2]['value']).contains('CIVIL_DAILY_CAUSE_LIST', 'Could not find civil list checkbox');
            expect(checkboxes[3]['value']).contains(
                'COUNTY_COURT_LONDON_CIVIL_DAILY_CAUSE_LIST',
                'Could not find county court london list checkbox'
            );
            expect(checkboxes[4]['value']).contains(
                'COURT_OF_APPEAL_CRIMINAL_DAILY_CAUSE_LIST',
                'Could not find court of appeal criminal division list checkbox'
            );
            expect(checkboxes[5]['value']).contains(
                'FAMILY_DIVISION_HIGH_COURT_DAILY_CAUSE_LIST',
                'Could not find family division list checkbox'
            );
            expect(checkboxes[6]['value']).contains(
                'INTELLECTUAL_PROPERTY_LIST_CHD_DAILY_CAUSE_LIST',
                'Could not find Rolls Building list checkbox'
            );
            expect(checkboxes[7]['value']).contains(
                'INTELLECTUAL_PROPERTY_AND_ENTERPRISE_COURT_DAILY_CAUSE_LIST',
                'Could not find Rolls Building list checkbox'
            );
            expect(checkboxes[8]['value']).contains(
                'KINGS_BENCH_DIVISION_DAILY_CAUSE_LIST',
                "Could not find king's bench division list checkbox"
            );
            expect(checkboxes[9]['value']).contains(
                'KINGS_BENCH_MASTERS_DAILY_CAUSE_LIST',
                "Could not find king's bench masters list checkbox"
            );
            expect(checkboxes[10]['value']).contains(
                'LONDON_ADMINISTRATIVE_COURT_DAILY_CAUSE_LIST',
                'Could not find london admin court list checkbox'
            );
            expect(checkboxes[11]['value']).contains(
                'LONDON_CIRCUIT_COMMERCIAL_COURT_KB_DAILY_CAUSE_LIST',
                'Could not find Rolls Building list checkbox'
            );
            expect(checkboxes[12]['value']).contains(
                'MAGISTRATES_PUBLIC_LIST',
                'Could not find magistrate public list checkbox'
            );
            expect(checkboxes[13]['value']).contains(
                'MAGISTRATES_STANDARD_LIST',
                'Could not find magistrate standard list checkbox'
            );
            expect(checkboxes[14]['value']).contains(
                'MAYOR_AND_CITY_CIVIL_DAILY_CAUSE_LIST',
                'Could not find mayor and city list checkbox'
            );
            expect(checkboxes[15]['value']).contains(
                'PATENTS_COURT_CHD_DAILY_CAUSE_LIST',
                'Could not find Rolls Building list checkbox'
            );
            expect(checkboxes[16]['value']).contains(
                'PENSIONS_LIST_CHD_DAILY_CAUSE_LIST',
                'Could not find Rolls Building list checkbox'
            );
            expect(checkboxes[17]['value']).contains(
                'PLANNING_COURT_DAILY_CAUSE_LIST',
                'Could not find planning court list checkbox'
            );
            expect(checkboxes[18]['value']).contains(
                'PROPERTY_TRUSTS_PROBATE_LIST_CHD_DAILY_CAUSE_LIST',
                'Could not find Rolls Building list checkbox'
            );
            expect(checkboxes[19]['value']).contains(
                'REVENUE_LIST_CHD_DAILY_CAUSE_LIST',
                'Could not find Rolls Building list checkbox'
            );
            expect(checkboxes[20]['value']).contains(
                'SENIOR_COURTS_COSTS_OFFICE_DAILY_CAUSE_LIST',
                'Could not find senior courts costs office list checkbox'
            );
            expect(checkboxes[21]['value']).contains('SJP_PRESS_LIST', 'Could not find SJP press list checkbox');
            expect(checkboxes[22]['value']).contains(
                'SJP_DELTA_PRESS_LIST',
                'Could not find SJP delta press list checkbox'
            );
            expect(checkboxes[23]['value']).contains(
                'SJP_PRESS_REGISTER',
                'Could not find SJP press register checkbox'
            );
            expect(checkboxes[24]['value']).contains('SJP_PUBLIC_LIST', 'Could not find SJP public list checkbox');
            expect(checkboxes[25]['value']).contains(
                'SJP_DELTA_PUBLIC_LIST',
                'Could not find SJP delta public list checkbox'
            );
            expect(checkboxes[26]['value']).contains(
                'TECHNOLOGY_AND_CONSTRUCTION_COURT_KB_DAILY_CAUSE_LIST',
                'Could not find Rolls Building list checkbox'
            );
        });
    });
});
