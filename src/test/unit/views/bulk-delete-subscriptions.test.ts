import request from 'supertest';
import { app } from '../../../main/app';
import { expect } from 'chai';
import moment from 'moment';
import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import {SubscriptionRequests} from '../../../main/resources/requests/subscriptionRequests';
import {LocationService} from '../../../main/service/locationService';

const PAGE_URL = '/bulk-delete-subscriptions';
let htmlRes: Document;

const subNavigationClass = 'moj-sub-navigation';
const tabsClass = 'moj-sub-navigation__link';
const caseNameColumn = 'Case name';
const caseReferenceColumn = 'Case reference number';
const dateAddedColumn = 'Date added';
const markForDeletionColumn = 'Mark for deletion';
const courtNameColumn = 'Court or tribunal name';

const expectedRowDateAdded = moment('2022-01-14T11:30:12.357299').format('DD MMMM YYYY');

const rawData = fs.readFileSync(path.resolve(__dirname, '../../../test/unit/mocks/userSubscriptions.json'), 'utf-8');
const subscriptionsData = JSON.parse(rawData);
const userSubscriptionsStub = sinon.stub(SubscriptionRequests.prototype, 'getUserSubscriptions');
const locationStub = sinon.stub(LocationService.prototype, 'getLocationById');

userSubscriptionsStub.withArgs('1').returns(subscriptionsData.data);
userSubscriptionsStub.withArgs('2').returns(
  {
    caseSubscriptions:[],
    locationSubscriptions:[],
  });

userSubscriptionsStub.withArgs('3').returns(
  {
    caseSubscriptions:[{
      subscriptionId: '5a45699f-47e3-4283-904a-581afe624155',
      caseName: 'Tom Clancy',
      caseNumber: 'T485913',
      urn: 'N363N6R4OG',
      dateAdded: '2022-01-14T11:30:12.357299',
    }],
    locationSubscriptions:[],
  });

userSubscriptionsStub.withArgs('4').returns(
  {
    caseSubscriptions:[],
    locationSubscriptions:[{
      subscriptionId: 'f038b7ea-2972-4be4-a5ff-70abb4f78686',
      locationName: 'Court 1',
      dateAdded: '2022-01-14T11:42:57.847708',
      locationId: 1,
    }],
  });

locationStub.withArgs(1).resolves(
  {
    locationId: 1,
    name: 'Test court 1',
    welshName: 'Welsh Test Court 1',
  });

describe('Bulk Delete Subscriptions Page', () => {
  describe('with both case and court subscriptions', () => {
    beforeAll(async () => {
      app.request['user'] = {'userId': '1', 'roles': 'VERIFIED'};
      await request(app)
        .get(PAGE_URL)
        .then(res => {
          htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
          htmlRes.getElementsByTagName('div')[0].remove();
        });
    });

    it('should have correct page title', () => {
      const pageTitle = htmlRes.title;
      expect(pageTitle).contains('Bulk delete subscriptions', 'Page title does not match header');
    });

    it('should display header', () => {
      const header = htmlRes.getElementsByClassName('govuk-heading-l')[0];
      expect(header.innerHTML)
        .contains('Bulk delete subscriptions', 'Could not find correct value in header');
    });

    it('should display all subscriptions tab with proper link', () => {
      const subscriptionsTabs = htmlRes.getElementsByClassName(subNavigationClass)[1]
        .getElementsByClassName(tabsClass);
      expect(subscriptionsTabs[0].innerHTML)
        .contains('All subscriptions (5)', 'Could not find all subscriptions tab');
      expect(subscriptionsTabs[0].getAttribute('href'))
        .equal('?all', 'Tab does not contain proper link');
    });

    it('should display case subscriptions tab with proper link', () => {
      const subscriptionsTabs = htmlRes.getElementsByClassName(subNavigationClass)[1]
        .getElementsByClassName(tabsClass);
      expect(subscriptionsTabs[1].innerHTML)
        .contains('Subscriptions by case (2)', 'Could not find case subscriptions tab');
      expect(subscriptionsTabs[1].getAttribute('href'))
        .equal('?case', 'Tab does not contain proper link');
    });

    it('should display court subscriptions tab with proper link', () => {
      const subscriptionsTabs = htmlRes.getElementsByClassName(subNavigationClass)[1]
        .getElementsByClassName(tabsClass);
      expect(subscriptionsTabs[2].innerHTML)
        .contains('Subscriptions by court or tribunal (3)', 'Could not find court subscriptions tab');
      expect(subscriptionsTabs[2].getAttribute('href'))
        .equal('?location', 'Tab does not contain proper link');
    });

    it('should display first tab as active', () => {
      const subscriptionsTabs = htmlRes.getElementsByClassName(subNavigationClass)[1]
        .getElementsByClassName(tabsClass);
      expect(subscriptionsTabs[0].getAttribute('aria-current'))
        .equal('page', 'All subscriptions tab does not have active attribute');
    });

    it('should display case subscriptions table with 4 columns', () => {
      const casesHeaders = htmlRes.getElementById('cases-table')
        .getElementsByClassName('govuk-table__header');
      expect(casesHeaders.length).equal(4);
    });

    it('should have correct columns in the cases table', () => {
      const caseHeaders = htmlRes.getElementById('cases-table')
        .getElementsByClassName('govuk-table__header');
      expect(caseHeaders[0].innerHTML).contains(caseNameColumn, 'Case name header is not present');
      expect(caseHeaders[1].innerHTML).contains(caseReferenceColumn, 'Case reference header is not present');
      expect(caseHeaders[2].innerHTML).contains(dateAddedColumn, 'Date added header is not present');
      expect(caseHeaders[3].innerHTML).contains(markForDeletionColumn, 'Mark for deletion header is not present');
    });

    it('should display court subscriptions table with 3 columns', () => {
      const courtHeaders = htmlRes.getElementById('locations-table')
        .getElementsByClassName('govuk-table__header');
      expect(courtHeaders.length).equal(3);
    });

    it('should have correct columns in the courts table', () => {
      const courtHeaders = htmlRes.getElementById('locations-table')
        .getElementsByClassName('govuk-table__header');
      expect(courtHeaders[0].innerHTML).contains(courtNameColumn, 'Court name header is not present');
      expect(courtHeaders[1].innerHTML).contains(dateAddedColumn, 'Date added header is not present');
      expect(courtHeaders[2].innerHTML).contains(markForDeletionColumn, 'Mark for deletion header is not present');
    });

    it('case table should have correct number of rows', () => {
      const subscriptionsCaseRows = htmlRes.getElementsByClassName('govuk-table__body')[0]
        .getElementsByClassName('govuk-table__row');
      expect(subscriptionsCaseRows.length).equal(2);
    });

    it('case table should have correct column values', () => {
      const subscriptionCaseRowCells = htmlRes.getElementsByClassName('govuk-table__body')[0]
        .getElementsByClassName('govuk-table__cell');
      expect(subscriptionCaseRowCells[0].innerHTML).contains('Tom Clancy');
      expect(subscriptionCaseRowCells[1].innerHTML).contains('T485913');
      expect(subscriptionCaseRowCells[2].innerHTML).contains(expectedRowDateAdded);

      const checkboxElement = subscriptionCaseRowCells[3].querySelector('input');
      expect(checkboxElement.getAttribute('type')).equal('checkbox');
      expect(checkboxElement.getAttribute('name')).equal('caseSubscription');
    });

    it('court table should have correct number of rows', () => {
      const subscriptionsCaseRows = htmlRes.getElementsByClassName('govuk-table__body')[1]
        .getElementsByClassName('govuk-table__row');
      expect(subscriptionsCaseRows.length).equal(3);
    });

    it('court table should have correct column values', () => {
      const subscriptionCaseRowCells = htmlRes.getElementsByClassName('govuk-table__body')[1]
        .getElementsByClassName('govuk-table__cell');
      expect(subscriptionCaseRowCells[0].innerHTML).contains('Test court 1');
      expect(subscriptionCaseRowCells[1].innerHTML).contains(expectedRowDateAdded);

      const checkboxElement = subscriptionCaseRowCells[2].querySelector('input');
      expect(checkboxElement.getAttribute('type')).equal('checkbox');
      expect(checkboxElement.getAttribute('name')).equal('courtSubscription');
    });

    it('should display bulk delete subscriptions button', () => {
      const button = htmlRes.getElementsByClassName('govuk-button');
      expect(button[0].innerHTML)
        .contains('Bulk Delete Subscriptions', 'Could not find new subscription button');
    });
  });

  describe('with no subscription', () => {
    beforeAll(async () => {
      app.request['user'] = {'userId': 2, 'roles': 'VERIFIED'};
    });

    it('should display no subscription message ', async () => {
      await request(app).get(PAGE_URL + '?all').then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
        htmlRes.getElementsByTagName('div')[0].remove();
        const message = htmlRes.getElementsByClassName('govuk-body');
        expect(message[0].innerHTML)
          .contains('You do not have any active subscriptions', 'Could not find correct message');
      });
    });

    it('should display no subscription case message ', async () => {
      await request(app).get(PAGE_URL + '?case').then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
        htmlRes.getElementsByTagName('div')[0].remove();
        const message = htmlRes.getElementsByClassName('govuk-body');
        expect(message[0].innerHTML)
          .contains('You do not have any active subscriptions', 'Could not find correct message');
      });
    });

    it('should display no subscription court message ', async () => {
      await request(app).get(PAGE_URL + '?court').then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
        htmlRes.getElementsByTagName('div')[0].remove();
        const message = htmlRes.getElementsByClassName('govuk-body');
        expect(message[0].innerHTML)
          .contains('You do not have any active subscriptions', 'Could not find correct message');
      });
    });
  });

  describe('with case subscriptions only', () => {
    beforeAll(async () => {
      app.request['user'] = {'userId': '3', 'roles': 'VERIFIED'};
      await request(app).get(PAGE_URL).then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
        htmlRes.getElementsByTagName('div')[0].remove();
      });
    });

    it('should display all subscriptions tab with proper link', () => {
      const subscriptionsTabs = htmlRes.getElementsByClassName(subNavigationClass)[1]
        .getElementsByClassName(tabsClass);
      expect(subscriptionsTabs[0].innerHTML)
        .contains('All subscriptions (1)', 'Could not find all subscriptions tab');
      expect(subscriptionsTabs[0].getAttribute('href'))
        .equal('?all', 'Tab does not contain proper link');
    });

    it('should display case subscriptions tab with proper link', () => {
      const subscriptionsTabs = htmlRes.getElementsByClassName(subNavigationClass)[1]
        .getElementsByClassName(tabsClass);
      expect(subscriptionsTabs[1].innerHTML)
        .contains('Subscriptions by case (1)', 'Could not find case subscriptions tab');
      expect(subscriptionsTabs[1].getAttribute('href'))
        .equal('?case', 'Tab does not contain proper link');
    });

    it('should display first tab as active', () => {
      const subscriptionsTabs = htmlRes.getElementsByClassName(subNavigationClass)[1]
        .getElementsByClassName(tabsClass);
      expect(subscriptionsTabs[0].getAttribute('aria-current'))
        .equal('page', 'All subscriptions tab does not have active attribute');
    });

    it('should display case subscriptions table with 4 columns', () => {
      const casesHeaders = htmlRes.getElementById('cases-table')
        .getElementsByClassName('govuk-table__header');
      expect(casesHeaders.length).equal(4);
    });

    it('should have correct columns in the cases table', () => {
      const caseHeaders = htmlRes.getElementById('cases-table')
        .getElementsByClassName('govuk-table__header');
      expect(caseHeaders[0].innerHTML).contains(caseNameColumn, 'Case name header is not present');
      expect(caseHeaders[1].innerHTML).contains(caseReferenceColumn, 'Case reference header is not present');
      expect(caseHeaders[2].innerHTML).contains(dateAddedColumn, 'Date added header is not present');
      expect(caseHeaders[3].innerHTML).contains(markForDeletionColumn, 'Mark for deletion header is not present');
    });

    it('should not display court subscriptions table', () => {
      const casesTable = htmlRes.getElementById('locations-table');
      expect(casesTable).equal(null, 'Courts table should not present');
    });

    it('case table should have correct number of rows', () => {
      const subscriptionsCaseRows = htmlRes.getElementsByClassName('govuk-table__body')[0]
        .getElementsByClassName('govuk-table__row');
      expect(subscriptionsCaseRows.length).equal(1);
    });

    it('case table should have correct column values', () => {
      const subscriptionCaseRowCells = htmlRes.getElementsByClassName('govuk-table__body')[0]
        .getElementsByClassName('govuk-table__cell');
      expect(subscriptionCaseRowCells[0].innerHTML).contains('Tom Clancy');
      expect(subscriptionCaseRowCells[1].innerHTML).contains('T485913');
      expect(subscriptionCaseRowCells[2].innerHTML).contains(expectedRowDateAdded);

      const checkboxElement = subscriptionCaseRowCells[3].querySelector('input');
      expect(checkboxElement.getAttribute('type')).equal('checkbox');
      expect(checkboxElement.getAttribute('name')).equal('caseSubscription');
    });
  });

  describe('with court subscriptions only', () => {
    beforeAll(async () => {
      app.request['user'] = {'userId': '4', 'roles': 'VERIFIED'};
      await request(app).get(PAGE_URL).then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
        htmlRes.getElementsByTagName('div')[0].remove();
      });
    });

    it('should display all subscriptions tab with proper link', () => {
      const subscriptionsTabs = htmlRes.getElementsByClassName(subNavigationClass)[1]
        .getElementsByClassName(tabsClass);
      expect(subscriptionsTabs[0].innerHTML)
        .contains('All subscriptions (1)', 'Could not find all subscriptions tab');
      expect(subscriptionsTabs[0].getAttribute('href'))
        .equal('?all', 'Tab does not contain proper link');
    });

    it('should display court subscriptions tab with proper link', () => {
      const subscriptionsTabs = htmlRes.getElementsByClassName(subNavigationClass)[1]
        .getElementsByClassName(tabsClass);
      expect(subscriptionsTabs[2].innerHTML)
        .contains('Subscriptions by court or tribunal (1)', 'Could not find case subscriptions tab');
      expect(subscriptionsTabs[2].getAttribute('href'))
        .equal('?location', 'Tab does not contain proper link');
    });

    it('should display first tab as active', () => {
      const subscriptionsTabs = htmlRes.getElementsByClassName(subNavigationClass)[1]
        .getElementsByClassName(tabsClass);
      expect(subscriptionsTabs[0].getAttribute('aria-current'))
        .equal('page', 'All subscriptions tab does not have active attribute');
    });

    it('should not display case subscriptions table', () => {
      const casesTable = htmlRes.getElementById('cases-table');
      expect(casesTable).equal(null, 'Cases table should not present');
    });

    it('should display court subscriptions table with 3 columns', () => {
      const courtHeaders = htmlRes.getElementById('locations-table')
        .getElementsByClassName('govuk-table__header');
      expect(courtHeaders.length).equal(3);
    });

    it('should have correct columns in the courts table', () => {
      const courtHeaders = htmlRes.getElementById('locations-table')
        .getElementsByClassName('govuk-table__header');
      expect(courtHeaders[0].innerHTML).contains(courtNameColumn, 'Court name header is not present');
      expect(courtHeaders[1].innerHTML).contains(dateAddedColumn, 'Date added header is not present');
      expect(courtHeaders[2].innerHTML).contains(markForDeletionColumn, 'Mark for deletion header is not present');
    });

    it('court table should have correct number of rows', () => {
      const subscriptionsCaseRows = htmlRes.getElementsByClassName('govuk-table__body')[0]
        .getElementsByClassName('govuk-table__row');
      expect(subscriptionsCaseRows.length).equal(1);
    });

    it('court table should have correct column values', () => {
      const subscriptionCaseRowCells = htmlRes.getElementsByClassName('govuk-table__body')[0]
        .getElementsByClassName('govuk-table__cell');
      expect(subscriptionCaseRowCells[0].innerHTML).contains('Test court 1');
      expect(subscriptionCaseRowCells[1].innerHTML).contains(expectedRowDateAdded);

      const checkboxElement = subscriptionCaseRowCells[2].querySelector('input');
      expect(checkboxElement.getAttribute('type')).equal('checkbox');
      expect(checkboxElement.getAttribute('name')).equal('courtSubscription');
    });
  });

  describe('with error', () => {
    beforeAll(async () => {
      app.request['user'] = {'userId': '1', 'roles': 'VERIFIED'};
      await request(app)
        .post(PAGE_URL)
        .send({}).then(res => {
          htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
        });
    });

    it('should display error summary', () => {
      const dialog = htmlRes.getElementsByClassName('govuk-error-summary');
      expect(dialog[0].getElementsByClassName('govuk-error-summary__title')[0].innerHTML)
        .contains('There is a problem', 'Could not find error dialog title');
    });

    it('should display error messages in the summary', () => {
      const list = htmlRes.getElementsByClassName(' govuk-error-summary__list')[0];
      const listItems = list.getElementsByTagName('a');
      expect(listItems[0].innerHTML).contains('At least one subscription must be selected', 'Could not find error');
    });
  });
});
