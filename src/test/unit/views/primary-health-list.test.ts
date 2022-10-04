import fs from 'fs';
import path from 'path';
import {PublicationService} from '../../../main/service/publicationService';
import sinon from 'sinon';
import request from 'supertest';
import {app} from '../../../main/app';
import {expect} from 'chai';

const PAGE_URL = '/primary-health-list?artefactId=abc';
const headingClass = 'govuk-heading-l';
const summaryHeading = 'govuk-details__summary-text';
const summaryText = 'govuk-details__text';

const summaryHeadingText = 'Important information';
const expectedHeader = 'Primary Health';
let htmlRes: Document;

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/primaryHealthList.json'), 'utf-8');
const primaryHealthList = JSON.parse(rawData);
const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').returns(primaryHealthList);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').returns(metaData);

describe('Primary health list page', () => {
  beforeAll(async () => {
    await request(app).get(PAGE_URL).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
    });
  });

  it('should display header',  () => {
    const header = htmlRes.getElementsByClassName(headingClass);
    expect(header[0].innerHTML).contains(expectedHeader, 'Could not find the header');
  });

  it('should display summary',  () => {
    const summary = htmlRes.getElementsByClassName(summaryHeading);
    expect(summary[0].innerHTML).contains(summaryHeadingText, 'Could not find the display summary heading');
  });

  it('should display court email summary paragraph',  () => {
    const summary = htmlRes.getElementsByClassName(summaryText);
    expect(summary[0].innerHTML).contains('court1@moj.gov.u', 'Could not find the court name in summary text');
  });

  // TODO
  // Should display table
  // Should display data source text
  // should contain list for text
  // should contain list updated text
});
