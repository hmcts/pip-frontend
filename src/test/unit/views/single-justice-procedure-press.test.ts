import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../../main/app';
import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import {PublicationService} from '../../../main/service/publicationService';

const PAGE_URL = '/sjp-press-list?artefactId=abc';
const headingClass = 'govuk-heading-l';
const summaryHeading = 'govuk-details__summary-text';
const listSummary = 'govuk-body govuk-!-font-weight-bold govuk-!-margin-bottom-1';
const offenderInformationClass = 'govuk-summary-list__value';
const reportingRestrictionClass = 'govuk-body';
const buttonClass = 'govuk-button';

const expectedHeader = 'Single Justice Procedure cases - Press view';
const summaryHeadingText = 'What are Single Justice Procedure cases?';
const listText = 'List for 14 February 2022';
const offenderName = 'Danny  Thomas';
const offenderDateOfBirth = '25 July 1985';
const offenderCaseNumber = 'ABC12345';
const offenderAddress = 'Swansea';
const prosecutor = 'qU8QlEo';
const reportingRestriction = 'Reporting Restriction - True';

let htmlRes: Document;

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/SJPMockPage.json'), 'utf-8');
const sjpList = JSON.parse(rawData);
const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').returns(sjpList);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').returns(metaData);

describe('Single Justice Procedure List page', () => {
  describe('user not signed in', () => {
    beforeAll(async () => {
      await request(app).get(PAGE_URL).then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
        htmlRes.getElementsByTagName('div')[0].remove();
      });
    });

    it('should display header', () => {
      const header = htmlRes.getElementsByClassName(headingClass);
      expect(header[0].innerHTML).contains(expectedHeader, 'Could not find the header');
    });

    it('should display summary',  () => {
      const summary = htmlRes.getElementsByClassName(summaryHeading);
      expect(summary[0].innerHTML).contains(summaryHeadingText, 'Could not find the display summary heading');
    });

    it('should display list date',  () => {
      const offenderData = htmlRes.getElementsByClassName(listSummary);
      expect(offenderData[0].innerHTML).contains(listText, 'Could not find the list date information');
    });

    it('should display the search input box', () => {
      const searchInput = htmlRes.getElementsByClassName('govuk-form-group');
      expect(searchInput[0].innerHTML).contains('Search Cases');
    });

    it('should have offender name',  () => {
      const offenderData = htmlRes.getElementsByClassName(offenderInformationClass);
      expect(offenderData[0].innerHTML).contains(offenderName, 'Could not find the offender name');
    });

    it('should have offender date of birth',  () => {
      const offenderData = htmlRes.getElementsByClassName(offenderInformationClass);
      expect(offenderData[1].innerHTML).contains(offenderDateOfBirth, 'Could not find the offender date of birth');
    });

    it('should have offender Case Reference',  () => {
      const offenderData = htmlRes.getElementsByClassName(offenderInformationClass);
      expect(offenderData[2].innerHTML).contains(offenderCaseNumber, 'Could not find the offender case reference');
    });

    it('should have offender address',  () => {
      const offenderData = htmlRes.getElementsByClassName(offenderInformationClass);
      expect(offenderData[3].innerHTML).contains(offenderAddress, 'Could not find the offender address');
    });

    it('should have prosecutor',  () => {
      const offenderData = htmlRes.getElementsByClassName(offenderInformationClass);
      expect(offenderData[4].innerHTML).contains(prosecutor, 'Could not find the Prosecutor');
    });

    it('should have reporting restriction section',  () => {
      const reportingRestrictionSection = htmlRes.getElementsByClassName(reportingRestrictionClass);
      expect(reportingRestrictionSection[4].innerHTML).contains(reportingRestriction, 'Could not find the reporting Restriction');
    });

    it('should not display the download button', () => {
      const buttons = htmlRes.getElementsByClassName(buttonClass);
      expect(buttons[0]).to.be.undefined;
    });
  });

  describe('signed in as media user', () => {
    beforeAll(async () => {
      app.request['user'] = {'roles': 'VERIFIED'};

      await request(app).get(PAGE_URL).then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
        htmlRes.getElementsByTagName('div')[0].remove();
      });
    });

    it('should display the download button', () => {
      const buttons = htmlRes.getElementsByClassName(buttonClass);
      expect(buttons[0].innerHTML).contains('Download a copy', 'Could not find the download button');
    });
  });

  describe('signed in as admin user', () => {
    beforeAll(async () => {
      app.request['user'] = {'roles': 'INTERNAL_SUPER_ADMIN_CTSC'};

      await request(app).get(PAGE_URL).then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
        htmlRes.getElementsByTagName('div')[0].remove();
      });
    });

    it('should not display the download button', () => {
      const buttons = htmlRes.getElementsByClassName(buttonClass);
      expect(buttons[0]).to.be.undefined;
    });
  });
});
