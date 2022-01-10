import request from 'supertest';
import {app} from '../../../main/app';
import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import {expect} from 'chai';
import {CourtService} from '../../../main/service/courtService';

const PAGE_URL = '/list-option?courtId=110';

let htmlRes: Document;

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/courtAndHearings.json'), 'utf-8');
const courtData = JSON.parse(rawData);

describe('List option page', () => {
  const stub = sinon.stub(CourtService.prototype, 'getCourtById');
  describe('Magistrates', () => {
    beforeAll(async () => {
      stub.resolves(courtData[0]);
      app.request['user'] = {id: 1};
      await request(app).get(PAGE_URL).then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
    });

    it('should display back button with the correct value', () => {
      const backLink = htmlRes.getElementsByClassName('govuk-back-link');
      expect(backLink[0].innerHTML)
        .contains('Back', 'Back button does not contain correct text');
      expect(backLink[0].getAttribute('href'))
        .equal('#', 'Back value does not contain correct link');
    });

    it('should contain the summary of publications heading', () => {
      const pageHeading = htmlRes.getElementsByClassName('govuk-heading-xl');
      expect(pageHeading[0].innerHTML)
        .contains('What do you want to view from Abergavenny Magistrates\' Court?', 'Page heading does not exist');
    });

    it('should display Magistrates court list', () => {
      const listHeading = htmlRes.getElementsByClassName('govuk-!-font-weight-bold');
      expect(listHeading[0].innerHTML)
        .contains('Magistrates\' Court', 'List heading does not exist');
    });

    it('should display standard list link', () => {
      const publicationOption = htmlRes.getElementsByClassName('govuk-link--no-visited-state');
      expect(publicationOption[0].innerHTML)
        .contains('Abergavenny Magistrates\' Court Standard Court Lists', 'Publication link does not exist');
      expect(publicationOption[0].getAttribute('href')).equal('/standard-list?courtId=1', 'links dont match');
    });

    it('should display public list link', () => {
      const publicationOption = htmlRes.getElementsByClassName('govuk-link--no-visited-state');
      expect(publicationOption[1].innerHTML)
        .contains('Abergavenny Magistrates\' Court Public Lists', 'Publication link does not exist');
    });
  });
  describe('Crown Court', () => {
    beforeAll(async () => {
      stub.resolves(courtData[1]);
      app.request['user'] = {id: 1};
      await request(app).get(PAGE_URL).then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
    });

    it('should display Crown court list', () => {
      const listHeading = htmlRes.getElementsByClassName('govuk-!-font-weight-bold');
      expect(listHeading[0].innerHTML)
        .contains('Crown Court lists', 'List heading does not exist');
    });

    it('should display Daily list link', () => {
      const publicationOption = htmlRes.getElementsByClassName('govuk-link--no-visited-state');
      expect(publicationOption[0].innerHTML)
        .contains('Accrington County Court Daily Lists', 'Publication link does not exist');
    });

    it('should display warned list link', () => {
      const publicationOption = htmlRes.getElementsByClassName('govuk-link--no-visited-state');
      expect(publicationOption[1].innerHTML)
        .contains('Accrington County Court Warned Lists', 'Publication link does not exist');
    });

    it('should display firmed list link', () => {
      const publicationOption = htmlRes.getElementsByClassName('govuk-link--no-visited-state');
      expect(publicationOption[2].innerHTML)
        .contains('Accrington County Court Firmed Lists', 'Publication link does not exist');
    });
  });
});
