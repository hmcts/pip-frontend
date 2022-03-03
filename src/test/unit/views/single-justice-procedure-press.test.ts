import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../../main/app';
import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import {PublicationService} from '../../../main/service/publicationService';
import {request as expressRequest} from 'express';

const PAGE_URL = '/sjp-press-list?artefactId=abc';
const headingClass = 'govuk-heading-l';
const summaryHeading = 'govuk-details__summary-text';
const listSummary = 'govuk-body govuk-!-font-weight-bold govuk-!-margin-bottom-1';

const expectedHeader = 'Single Justice Procedure cases - Press view';
const summaryHeadingText = 'What are Single Justice Procedure cases?';
const listText = 'List for 14 February 2022';

let htmlRes: Document;

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/SJPMockPage.json'), 'utf-8');
const sjpList = JSON.parse(rawData);
const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').returns(sjpList);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').returns(metaData);
sinon.stub(expressRequest, 'isAuthenticated').returns(true);

describe('Single Justice Procedure List page', () => {
  beforeAll(async () => {
    await request(app).get(PAGE_URL).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
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
    const listDate = htmlRes.getElementsByClassName(listSummary);
    expect(listDate[0].innerHTML).contains(listText, 'Could not find the list date information');
  });
});
