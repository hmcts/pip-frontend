import {app} from '../../../main/app';
import request from 'supertest';
import fs from 'fs';
import path from 'path';
import {expect} from 'chai';
import sinon from 'sinon';
import {CourtService} from '../../../main/service/courtService';

const PAGE_URL = '/standard-list?locationId=10';

let htmlRes: Document;
const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/courtAndHearings.json'), 'utf-8');
const courtData = JSON.parse(rawData);
sinon.stub(CourtService.prototype, 'getCourtById').resolves(courtData[0]);

describe('Standard list page', () => {
  beforeAll(async () => {
    app.request['user'] = {id: 1};
    await request(app).get(PAGE_URL).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
    });
  });

  it('should display heading', () => {
    const header = htmlRes.getElementsByClassName('govuk-heading-xl');
    expect(header[0].innerHTML).contains('Abergavenny Magistrates\' Court:', 'Header was not found');
  });

  it('should display heading; standard list', () => {
    const header = htmlRes.getElementsByClassName('govuk-heading-xl');
    expect(header[1].innerHTML).contains('Standard list', 'Header was not found');
  });

  it('should display courtroom 1', () => {
    const courtRooms = htmlRes.getElementsByClassName('govuk-heading-l');
    expect(courtRooms[0].innerHTML).contains('Courtroom 1', 'Court room not found');
  });

  it('should display courtroom 2', () => {
    const courtRooms = htmlRes.getElementsByClassName('govuk-heading-l');
    expect(courtRooms[1].innerHTML).contains('Courtroom 2', 'Court room not found');
  });

  it('should display table', () => {
    const summary = htmlRes.getElementsByClassName('govuk-summary-list')[0];
    expect(summary.innerHTML).contains('Defendant', 'Summary data could not be found');
  });
});
