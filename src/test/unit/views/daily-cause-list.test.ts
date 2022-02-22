import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../../main/app';
import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import {PublicationService} from '../../../main/service/publicationService';
import {request as expressRequest} from 'express';

const PAGE_URL = '/daily-cause-list?artefactId=abc';
const headingClass = 'govuk-heading-l';
const summaryHeading = 'govuk-details__summary-text';
const summaryText = 'govuk-details__text';
const accordionClass='govuk-accordion__section-button';

const expectedHeader = 'Daily Civil Cause list for <br>PRESTON';
const summaryHeadingText = 'Important information';
const accordionHeading = '1; Mr Firstname1 Surname1';

let htmlRes: Document;

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/dailyCauseList.json'), 'utf-8');
const dailyCauseListData = JSON.parse(rawData);

const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];

sinon.stub(PublicationService.prototype, 'getIndivPubJson').returns(dailyCauseListData);
sinon.stub(PublicationService.prototype, 'getIndivPubMetadata').returns(metaData);
sinon.stub(expressRequest, 'isAuthenticated').returns(true);

describe('Daily Cause List page', () => {
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

  it('should display court name summary paragraph',  () => {
    const summary = htmlRes.getElementsByClassName(summaryText);
    expect(summary[0].innerHTML).contains('PRESTON', 'Could not find the court name in summary text');
  });

  it('should display court email summary paragraph',  () => {
    const summary = htmlRes.getElementsByClassName(summaryText);
    expect(summary[0].innerHTML).contains('court1@moj.gov.u', 'Could not find the court name in summary text');
  });

  it('should display court contact number summary paragraph',  () => {
    const summary = htmlRes.getElementsByClassName(summaryText);
    expect(summary[0].innerHTML).contains('01772 844700', 'Could not find the court name in summary text');
  });

  it('should display accordion open/close all',  () => {
    const accordion = htmlRes.getElementsByClassName(accordionClass);
    expect(accordion[0].innerHTML).contains(accordionHeading, 'Could not find the accordion heading');
  });

  it('should display Case ID',  () => {
    const cell = htmlRes.getElementsByClassName('govuk-table__cell');
    expect(cell[0].innerHTML).contains('12345678');
  });

  it('should display Case Name',  () => {
    const cell = htmlRes.getElementsByClassName('govuk-table__cell');
    expect(cell[1].innerHTML).contains('A1 Vs B1');
  });

  it('should display Hearing Type',  () => {
    const cell = htmlRes.getElementsByClassName('govuk-table__cell');
    expect(cell[2].innerHTML).contains('FHDRA1 (First Hearing and Dispute Resolution Appointment)');
  });

  it('should display Hearing platform',  () => {
    const cell = htmlRes.getElementsByClassName('govuk-table__cell');
    expect(cell[3].innerHTML).contains('VIDEO HEARING');
  });

  it('should display Hearing start time',  () => {
    const cell = htmlRes.getElementsByClassName('govuk-table__cell');
    expect(cell[4].innerHTML).contains('9.40am');
  });

  it('should display Hearing duration',  () => {
    const cell = htmlRes.getElementsByClassName('govuk-table__cell');
    expect(cell[5].innerHTML).contains('1 hour');
  });
});
