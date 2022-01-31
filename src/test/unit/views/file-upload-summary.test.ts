import request from 'supertest';
import sinon from 'sinon';
import { app } from '../../../main/app';
import { expect } from 'chai';
import { request as expressRequest } from 'express';

let htmlRes: Document;
const PAGE_URL = '/file-upload-summary';

describe('File Upload Summary Page', () => {
  beforeAll(async () => {
    sinon.stub(expressRequest, 'isAuthenticated').returns(true);

    await request(app).get(PAGE_URL).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
    });
  });

  it('should display correct title', async () => {
    const title = htmlRes.getElementsByClassName('govuk-heading-l');
    expect(title[0].innerHTML).to.equal('Check your answers');
  });
});
