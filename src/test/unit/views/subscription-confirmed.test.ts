import { app } from '../../../main/app';
import { expect } from 'chai';
import { request as expressRequest } from 'express';
import { SubscriptionService } from '../../../main/service/subscriptionService';
import { PendingSubscriptionsFromCache } from '../../../main/resources/requests/utils/pendingSubscriptionsFromCache';
import request from 'supertest';
import sinon from 'sinon';

const PAGE_URL = '/subscription-confirmed';
let htmlRes: Document;
sinon.stub(SubscriptionService.prototype, 'subscribe').resolves(true);
sinon.stub(expressRequest, 'isAuthenticated').returns(true);
const cacheStub = sinon.stub(PendingSubscriptionsFromCache.prototype, 'getPendingSubscriptions');
cacheStub.withArgs('1', 'cases').resolves(['case']);
cacheStub.withArgs('1', 'courts').resolves(['court']);

describe('Subscriptions Confirmed Page', () => {
  beforeAll(async () => {
    app.request['user'] = {oid: '1'};
    await request(app).post(PAGE_URL).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
    });
  });

  it('should display confirmation panel with correct title and message', () => {
    const panel = htmlRes.getElementsByClassName('govuk-panel--confirmation')[0];
    expect(panel.getElementsByClassName('govuk-panel__title')[0].innerHTML)
      .contains('Subscription confirmed', 'Could not find panel title or is incorrect');
    expect(panel.getElementsByClassName('govuk-panel__body')[0].innerHTML)
      .contains('Your subscription has been successful.', 'Could not find panel message or is incorrect');
  });

  it('should contain you account url', () => {
    const youAccountLink = htmlRes.getElementsByClassName('govuk-body')[0]
      .getElementsByTagName('a')[0];
    expect(youAccountLink.innerHTML).to.equal('your account');
    expect(youAccountLink.getAttribute('href')).to.equal('/account-home');
  });

  it('should display unordered list with 3 elements with correct values', () => {
    const listElements = htmlRes.getElementsByClassName('govuk-list--bullet')[0]
      .getElementsByTagName('li');
    expect(listElements.length).to.equal(3);
    expect(listElements[0].innerHTML).to.equal('add a new subscription');
    expect(listElements[1].innerHTML).to.equal('manage your current subscriptions');
    expect(listElements[2].innerHTML).to.equal('find a court or tribunal');
  });
});
