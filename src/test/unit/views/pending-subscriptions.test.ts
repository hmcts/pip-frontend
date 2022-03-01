import { app } from '../../../main/app';
import { expect } from 'chai';
import { PendingSubscriptionsFromCache } from '../../../main/resources/requests/utils/pendingSubscriptionsFromCache';
import { request as expressRequest } from 'express';
import request from 'supertest';
import sinon from 'sinon';

const mockCase = {
  hearingId: 1,
  courtId: 50,
  courtNumber: 1,
  date: '15/11/2021 10:00:00',
  judge: 'His Honour Judge A Morley QC',
  platform: 'In person',
  caseNumber: 'T485913',
  caseName: 'Tom Clancy',
  caseUrn: 'N363N6R4OG',
};
const mockCourt = {
  courtId: 643,
  name: 'Aberdeen Tribunal Hearing Centre',
  jurisdiction: 'Tribunal',
  location: 'Scotland',
  hearingList: [],
  hearings: 0,
};
const PAGE_URL = '/pending-subscriptions';
const backLinkClass = 'govuk-back-link';
const tableHeaderClass = 'govuk-table__header';
let htmlRes: Document;

const getSubscriptionsStub = sinon.stub(PendingSubscriptionsFromCache.prototype, 'getPendingSubscriptions');
getSubscriptionsStub.withArgs('1', 'cases').resolves([mockCase]);
getSubscriptionsStub.withArgs('1', 'courts').resolves([mockCourt]);
getSubscriptionsStub.withArgs('2', 'cases').resolves([]);
getSubscriptionsStub.withArgs('2', 'courts').resolves([]);
sinon.stub(expressRequest, 'isAuthenticated').returns(true);

describe('Pending Subscriptions Page', () => {
  describe('user with subscriptions', () => {
    beforeAll(async () => {
      app.request['user'] = {oid: '1'};
      await request(app).get(PAGE_URL).then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
    });

    it('should display back button', () => {
      const backButton = htmlRes.getElementsByClassName(backLinkClass);
      expect(backButton[0].innerHTML).contains('Back');
    });

    it('should display title', () => {
      const title = htmlRes.getElementsByClassName('govuk-heading-l');
      expect(title[0].innerHTML).contains('Confirm your email subscriptions');
    });

    it('should display correct case table headers', () => {
      const tableHeaders = htmlRes.getElementsByClassName(tableHeaderClass);
      expect(tableHeaders[0].innerHTML).contains('Unique reference number (URN)', 'Could not find text in first header');
      expect(tableHeaders[1].innerHTML).contains('Case reference number or case ID', 'Could not find text in second header');
      expect(tableHeaders[2].innerHTML).contains('Case name', 'Could not find text in third header');
      expect(tableHeaders[3].innerHTML).contains('Actions', 'Could not find text in fourth header');
    });

    it('should display correct court table headers', () => {
      const tableHeaders = htmlRes.getElementsByClassName('govuk-table')[1]
        .getElementsByClassName('govuk-table__header');
      expect(tableHeaders[0].innerHTML).contains('Court or tribunal name', 'Could not find text in first header');
      expect(tableHeaders[1].innerHTML).contains('Actions', 'Could not find text in second header');
    });

    it('should contain 1 row in the case table with correct values', () => {
      const rows = htmlRes.getElementsByClassName('govuk-table__body')[0].getElementsByClassName('govuk-table__row');
      const cells = rows[0].getElementsByClassName('govuk-table__cell');
      expect(rows.length).equal(1, 'Case table did not contain expected number of rows');
      expect(cells[0].innerHTML).contains(mockCase.caseUrn, 'First cell does not contain correct value');
      expect(cells[1].innerHTML).contains(mockCase.caseNumber, 'Second cell does not contain correct value');
      expect(cells[2].innerHTML).contains(mockCase.caseName, 'Third cell does not contain correct value');
      expect(cells[3].innerHTML).contains('Remove', 'Fourth cell does not contain correct value');
      expect(cells[3].querySelector('a').getAttribute('href')).equal(`/remove-subscription?case=${mockCase.caseNumber}`);
    });

    it('should contain 1 row in the court table with correct values', () => {
      const rows = htmlRes.getElementsByClassName('govuk-table__body')[1].getElementsByClassName('govuk-table__row');
      const cells = rows[0].getElementsByClassName('govuk-table__cell');
      expect(rows.length).equal(1, 'Case table did not contain expected number of rows');
      expect(cells[0].innerHTML).contains(mockCourt.name, 'First cell does not contain correct value');
      expect(cells[1].innerHTML).contains('Remove', 'Fourth cell does not contain correct value');
      expect(cells[1].querySelector('a').getAttribute('href')).equal(`/remove-subscription?court=${mockCourt.courtId}`);
    });

    it('should contain confirm subscriptions button', () => {
      const button = htmlRes.getElementsByClassName('govuk-button')[0];
      expect(button.innerHTML).contains('Confirm Subscriptions', 'Could not find submit button');
    });

    it('should display add another link', () => {
      const addAnotherLink = htmlRes.getElementsByClassName('govuk-!-text-align-centre')[0];
      expect(addAnotherLink.getElementsByClassName('govuk-link')[0].innerHTML).contains('Add another', 'Could not find add another link');
      expect(addAnotherLink.querySelector('a').getAttribute('href')).equal('/subscription-add');
    });
  });

  describe('user without subscriptions', () => {
    beforeAll(async () => {
      app.request['user'] = {oid: '2'};
      await request(app).get(PAGE_URL).then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
    });

    it('should not contain any case table rows', () => {
      const rows = htmlRes.getElementsByClassName('govuk-table__body')[0].getElementsByClassName('govuk-table__row');
      expect(rows.length).equal(0, 'Case table did not contain expected number of rows');
    });

    it('should not contain any court table rows', () => {
      const rows = htmlRes.getElementsByClassName('govuk-table__body')[1].getElementsByClassName('govuk-table__row');
      expect(rows.length).equal(0, 'Court table did not contain expected number of rows');
    });

    it('should display no pending subscriptions messages', () => {
      const messages = htmlRes.getElementsByClassName('govuk-body');
      expect(messages[0].innerHTML).equal('No pending case subscriptions');
      expect(messages[1].innerHTML).equal('No pending court subscriptions');
    });
  });

  describe('user without subscriptions error screen', () => {
    beforeAll(async () => {
      app.request['user'] = {oid: '2'};
      await request(app).get(`${PAGE_URL}?no-subscriptions=true`).then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
    });

    it('should display error summary if user tries to confirm 0 subscriptions', () => {
      const errorSummaryList = htmlRes.getElementsByClassName('govuk-error-summary__list')[0];
      const errorSummaryTitle = htmlRes.getElementById('error-summary-title');
      expect(errorSummaryList.innerHTML).contains('At least 1 subscription is needed.');
      expect(errorSummaryTitle.innerHTML).contains('There is a problem');
    });

    it('should display add subscriptions button', () => {
      const button = htmlRes.getElementsByClassName('govuk-button')[0];
      expect(button.innerHTML).contains('Add Subscriptions');
    });

    it('should not display add another link', () => {
      const addAnotherLink = htmlRes.getElementsByClassName('govuk-!-text-align-centre');
      expect(addAnotherLink.length).equal(0);
    });
  });
});
