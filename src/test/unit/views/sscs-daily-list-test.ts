import fs from 'fs';
import path from 'path';
import { PublicationService } from '../../../main/service/publicationService';
import { LocationService } from '../../../main/service/locationService';
import sinon from 'sinon';
import request from 'supertest';
import { app } from '../../../main/app';
import { expect } from 'chai';
import { request as expressRequest } from 'express';
import { describe } from '@jest/globals';

const userId = '1234';
const sscDailyListUrl = '/sscs-daily-list';
const sscDailyListAdditionalHearingsUrl = '/sscs-daily-list-additional-hearings';

const artefactIdMap = new Map<string, string>([
    [sscDailyListUrl, 'abc'],
    [sscDailyListAdditionalHearingsUrl, 'def'],
]);

const titleTextMap = new Map<string, string>([
    [sscDailyListUrl, 'SSCS Daily List'],
    [sscDailyListAdditionalHearingsUrl, 'SSCS Daily List - Additional Hearings'],
]);

const headingClass = 'govuk-heading-l';
const summaryHeading = 'govuk-details__summary-text';
const summaryText = 'govuk-details__text';
const warningClass = 'govuk-warning-text__text';
const tableHeader = 'govuk-table__header';
const tableCell = 'govuk-table__cell';

const courtName = "Abergavenny Magistrates' Court";
const expectedHeader = courtName + ' hearings for';
const summaryHeadingText = 'Important information';
const expectWarningText =
    'Please note: There may be 2 hearing lists available for this date. Please make sure you look at both lists to see all hearings happening on this date for this location.';
let htmlRes: Document;

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/sscsDailyList.json'), 'utf-8');
const sscsDailyList = JSON.parse(rawData);

const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../mocks/returnedArtefacts.json'), 'utf-8');

const metaDataSscs = JSON.parse(rawMetaData)[0];
metaDataSscs.listType = 'SSCS_DAILY_LIST';

const metaDataSscsAdditionalHearings = JSON.parse(rawMetaData)[0];
metaDataSscsAdditionalHearings.listType = 'SSCS_DAILY_LIST_ADDITIONAL_HEARINGS';

const rawDataCourt = fs.readFileSync(path.resolve(__dirname, '../mocks/courtAndHearings.json'), 'utf-8');
const courtData = JSON.parse(rawDataCourt);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').returns(sscsDailyList);
sinon.stub(LocationService.prototype, 'getLocationById').resolves(courtData[0]);

const metadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
metadataStub.withArgs(artefactIdMap.get(sscDailyListUrl), userId).returns(metaDataSscs);
metadataStub
    .withArgs(artefactIdMap.get(sscDailyListAdditionalHearingsUrl), userId)
    .returns(metaDataSscsAdditionalHearings);

expressRequest['user'] = { userId: userId };

describe.each([sscDailyListUrl, sscDailyListAdditionalHearingsUrl])("Sscs daily list page with path '%s'", url => {
    const pageUrl = url + '?artefactId=' + artefactIdMap.get(url);

    beforeAll(async () => {
        await request(app)
            .get(pageUrl)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
            });
    });

    it('should have correct page title', () => {
        const pageTitle = htmlRes.title;
        expect(pageTitle).equals(titleTextMap.get(url), 'Page title does not match header');
    });

    it('should display header', () => {
        const header = htmlRes.getElementsByClassName(headingClass);
        expect(header[0].innerHTML).contains(expectedHeader, 'Could not find the header');
    });

    it('should display warning', () => {
        const header = htmlRes.getElementsByClassName(warningClass);
        expect(header[0].innerHTML).contains(expectWarningText, 'Could not find the warning text');
    });

    it('should display summary', () => {
        const summary = htmlRes.getElementsByClassName(summaryHeading);
        expect(summary[0].innerHTML).contains(summaryHeadingText, 'Could not find the display summary heading');
    });

    it('should display the search input box', () => {
        const searchInput = htmlRes.getElementsByClassName('govuk-form-group');
        expect(searchInput[0].innerHTML).contains('Search Cases');
    });

    it('should display court name summary paragraph', () => {
        const summary = htmlRes.getElementsByClassName(summaryText);
        expect(summary[0].innerHTML).contains(courtName, 'Could not find the court name in summary text');
    });

    it('should display court email summary paragraph', () => {
        const summary = htmlRes.getElementsByClassName(summaryText);
        expect(summary[0].innerHTML).contains('court1@moj.gov.u', 'Could not find the court name in summary text');
    });

    it('should display court contact number summary paragraph', () => {
        const summary = htmlRes.getElementsByClassName(summaryText);
        expect(summary[0].innerHTML).contains('01772 844700', 'Could not find the court name in summary text');
    });

    it('should display correct table headers', () => {
        const headers = htmlRes.getElementsByClassName(tableHeader);
        expect(headers[0].innerHTML).contains('Hearing Time');
        expect(headers[1].innerHTML).contains('Appeal reference number');
        expect(headers[2].innerHTML).contains('Tribunal type');
        expect(headers[3].innerHTML).contains('Appellant');
        expect(headers[4].innerHTML).contains('FTA/Respondent');
        expect(headers[5].innerHTML).contains('Panel');
    });

    it('should display hearing time', () => {
        const data = htmlRes.getElementsByClassName(tableCell);
        expect(data[0].innerHTML).contains('10:40am', 'Hearing time does not match');
    });

    it('should display case number', () => {
        const data = htmlRes.getElementsByClassName(tableCell);
        expect(data[1].innerHTML).contains('12341234', 'Case number does not match');
    });

    it('should display tribunal type', () => {
        const data = htmlRes.getElementsByClassName(tableCell);
        expect(data[2].innerHTML).contains('Teams, Attended', 'Tribunal type does not match');
    });

    it('should display appellant', () => {
        const data = htmlRes.getElementsByClassName(tableCell);
        expect(data[3].innerHTML).contains(
            'Surname, Legal Advisor: Mr Individual Forenames Individual Middlenam',
            'Appellant does not match'
        );
    });

    it('should display respondent using informant', () => {
        const data = htmlRes.getElementsByClassName(tableCell);
        expect(data[4].innerHTML).contains('test, test2', 'Respondent (informant) does not match');
    });

    it('should display respondent using party prosecutor', () => {
        const data = htmlRes.getElementsByClassName(tableCell);
        expect(data[10].innerHTML).contains('Prosecutor1, Prosecutor2', 'Respondent (party prosecutor) does not match');
    });

    it('should display panel', () => {
        const data = htmlRes.getElementsByClassName(tableCell);
        expect(data[5].innerHTML).contains('Judge Test Name, Magistrate Test Name', 'Panel does not match');
    });
});
