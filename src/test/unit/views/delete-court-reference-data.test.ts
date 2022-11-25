import { app } from '../../../main/app';
import { expect } from 'chai';
import { LocationRequests } from '../../../main/resources/requests/locationRequests';
import fs from 'fs';
import path from 'path';
import request from 'supertest';
import sinon from 'sinon';
import {request as expressRequest} from 'express';

const PAGE_URL = '/delete-court-reference-data';
const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/courtAndHearings.json'), 'utf-8');
const courtData = JSON.parse(rawData);
sinon.stub(LocationRequests.prototype, 'getAllLocations').returns(courtData);

const tableHeaders = ['Court or Tribunal Name', 'Location Type', 'Jurisdiction', 'Region', 'Actions'];

expressRequest['user'] = {'_json': {
  'extension_UserRole': 'SYSTEM_ADMIN',
}};

let htmlRes: Document;

describe('Delete Court Reference Page', () => {
  beforeAll(async () => {
    await request(app).get(PAGE_URL).then(response => {
      htmlRes = new DOMParser().parseFromString(response.text, 'text/html');
      htmlRes.getElementsByTagName('div')[0].remove();
    });
  });

  it('should display the header',  () => {
    const header = htmlRes.getElementsByClassName('govuk-heading-l');
    expect(header[0].innerHTML).contains('Select a court to remove', 'Could not find the header');
  });

  it('should display results count', () => {
    const resultsCount = htmlRes.getElementsByClassName('govuk-body')[0];
    expect(resultsCount.innerHTML).contains('Showing 12 result(s)', 'Could not find results paragraph');
  });

  it('should display correct table headers', () => {
    const headerNames = htmlRes.getElementsByClassName('govuk-table__header');
    for (let i=0; i < tableHeaders.length; i++) {
      expect(headerNames[i].innerHTML).contains(tableHeaders[i], `Could not find correct header (${tableHeaders[i]})`);
    }
  });

  it('should display correct row values', () => {
    const tableRows = htmlRes.getElementsByClassName('govuk-table__body')[0].getElementsByClassName('govuk-table__row');
    expect(tableRows.length).equal(12, 'Incorrect table rows count');
    const rowCells = tableRows[0].getElementsByClassName('govuk-table__cell');
    const removeActionHref = htmlRes.getElementsByClassName('unsubscribe-action')[0].getAttribute('href').valueOf();
    expect(rowCells[0].innerHTML).equal('Abergavenny Magistrates\' Court', 'Could not find court name');
    expect(rowCells[1].innerHTML).equal('VENUE', 'Could not list type');
    expect(rowCells[2].innerHTML).equal('Magistrates', 'Could not find jurisdiction');
    expect(rowCells[3].innerHTML).equal('Bedford', 'Could not find region');
    expect(removeActionHref).contains('delete-court-reference-data-confirmation?locationId=1',
      'Could not find valid action href');
  });
});
