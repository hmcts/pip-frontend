import request from 'supertest';
import sinon from 'sinon';
import moment from 'moment';
import { app } from '../../../main/app';
import { expect } from 'chai';
import { request as expressRequest } from 'express';

let htmlRes: Document;
const PAGE_URL = '/manual-upload-summary';
const summaryKeys = ['File', 'Court name', 'Document name', 'List type', 'Hearing dates', 'Available to', 'Language', 'Display file dates'];
const mockData = {
  artefactType: 'LIST',
  classification: 'PUBLIC',
  'content-date-from': moment().format('D MMM YYYY'),
  'content-date-to': moment().format('D MMM YYYY'),
  court: {
    courtName: 'Aberdeen Tribunal Hearing Centre',
  },
  'display-from': moment().format('D MMM YYYY'),
  'display-to': moment().format('D MMM YYYY'),
  fileName: 'Demo.pdf',
  language: 'ENGLISH',
  listType: 'SJP_PUBLIC_LIST',
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
    expect(title.innerHTML).to.equal('Check your answers', 'Unable to find header');
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
    const values = htmlRes.getElementsByClassName('govuk-summary-list__value');
    expect(values[0].innerHTML).to.contain(mockData.fileName, 'File value not found');
    expect(values[1].innerHTML).to.contain(mockData.court.courtName, 'Court value not found');
    expect(values[2].innerHTML).to.contain(mockData.artefactType, 'Document type value not found');
    expect(values[3].innerHTML).to.contain(mockData.listType, 'List type value not found');
    expect(values[4].innerHTML).to.contain(`${mockData['content-date-from']} to ${mockData['content-date-to']}`, 'Hearing dates values not found');
    expect(values[5].innerHTML).to.contain(mockData.classification, 'Classification values not found');
    expect(values[6].innerHTML).to.contain(mockData.language, 'Language value not found');
    expect(values[7].innerHTML).to.contain(`${mockData['display-from']} to ${mockData['display-to']}`, 'Display dates values not found');
  });
});
