import request from 'supertest';
import sinon from 'sinon';
import { app } from '../../../main/app';
import { expect } from 'chai';
import { request as expressRequest } from 'express';

const PAGE_URL = '/upload-confirmation';
let htmlRes: Document;

describe('File Upload Confirmation Page', () => {
  beforeAll(async () => {
    sinon.stub(expressRequest, 'isAuthenticated').returns(true);

    await request(app).get(PAGE_URL).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
    });
  });

  it('should display confirmation within the panel', () => {
    const panelTitle = htmlRes.getElementsByClassName('govuk-panel__title');
    const panelMessage = htmlRes.getElementsByClassName('govuk-panel__body');
    expect(panelTitle[0].innerHTML).to.contains('Success');
    expect(panelMessage[0].innerHTML).to.contains('Your file has been uploaded');
  });

  it('should display what happens next message', () => {
    const message = htmlRes.getElementsByClassName('govuk-body')[0];
    expect(message.innerHTML).to.equal('What happens next');
  });

  it('should display links to other actions with correct paths', () => {
    const links = htmlRes.getElementsByClassName('govuk-link ');
    expect(links[0].innerHTML).to.equal('Upload another file');
    expect(links[0].getAttribute('href')).contains('manual-upload');
    expect(links[1].innerHTML).to.equal('Remove file');
    expect(links[1].getAttribute('href')).contains('remove-list-search');
    expect(links[2].innerHTML).to.equal('Home');
    expect(links[2].getAttribute('href')).contains('admin-dashboard');
  });
});
