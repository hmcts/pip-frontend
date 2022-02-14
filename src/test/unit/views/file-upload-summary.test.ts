import request from 'supertest';
import sinon from 'sinon';
import moment from 'moment';
import { app } from '../../../main/app';
import { expect } from 'chai';
import { request as expressRequest } from 'express';

let htmlRes: Document;
const PAGE_URL = '/manual-upload-summary';
const summaryKeys = ['Court name', 'File', 'List type', 'Hearing start date', 'Available to', 'Language', 'Display file dates'];
const mockData = {
  artefactType: 'List',
  classification: 'Public',
  'content-date-from': '01/01/2022',
  court: {
    courtName: 'Aberdeen Tribunal Hearing Centre',
  },
  'display-from': '02/03/2022',
  'display-to': '04/05/2022',
  fileName: 'Demo.pdf',
  language: 'English',
  listType: 'SJP_PUBLIC_LIST',
  listTypeName: 'SJP Public List',
};

describe('File Upload Summary Page', () => {
  beforeAll(async () => {
    sinon.stub(expressRequest, 'isAuthenticated').returns(true);
    app.request['user'] = {id: '1'};
    app.request['cookies'] = {'formCookie': JSON.stringify(mockData)};

    await request(app).get(PAGE_URL).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
    });
  });

  it('should display correct title', async () => {
    const title = htmlRes.getElementsByClassName('govuk-heading-l')[0];
    expect(title.innerHTML).to.equal('Check upload details', 'Unable to find header');
  });

  it('should display confirm button', async () => {
    const button = htmlRes.getElementsByClassName('govuk-button')[0];
    expect(button.innerHTML).to.contain('Confirm', 'Unable to find confirm button');
  });

  it('should display correct summary keys and actions', async () => {
    const keys = htmlRes.getElementsByClassName('govuk-summary-list__key');
    const actions = htmlRes.getElementsByClassName('govuk-summary-list__actions');
    for (let i = 0; i < summaryKeys.length; i++) {
      expect(keys[i].innerHTML).to.contain(summaryKeys[i], `Unable to find ${summaryKeys[i]} summary key`);
      expect(actions[i].getElementsByClassName('govuk-link')[0].innerHTML).to.contain('Change');
      expect(actions[i].getElementsByClassName('govuk-link')[0].getAttribute('href')).to.equal('manual-upload');
    }
  });

  it('should display correct summary values', async () => {
    const formatContentDate = moment(mockData['content-date-from'], 'DD/MM/YYYY').format('D MMM YYYY');
    const formatDisplayFromDate = moment(mockData['display-from'], 'DD/MM/YYYY').format('D MMM YYYY');
    const formatDisplayToDate = moment(mockData['display-to'], 'DD/MM/YYYY').format('D MMM YYYY');
    const values = htmlRes.getElementsByClassName('govuk-summary-list__value');
    expect(values[0].innerHTML).to.contain(mockData.court.courtName, 'Court value not found');
    expect(values[1].innerHTML).to.contain(mockData.fileName, 'File value not found');
    expect(values[2].innerHTML).to.contain(mockData.listTypeName, 'List type value not found');
    expect(values[3].innerHTML).to.contain(formatContentDate, 'Hearing start date value not found');
    expect(values[4].innerHTML).to.contain(mockData.classification, 'Classification values not found');
    expect(values[5].innerHTML).to.contain(mockData.language, 'Language value not found');
    expect(values[6].innerHTML).to.contain(`${formatDisplayFromDate} to ${formatDisplayToDate}`, 'Display dates values not found');
  });
});
