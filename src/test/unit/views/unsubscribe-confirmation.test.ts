import request from 'supertest';
import sinon from 'sinon';
import { app } from '../../../main/app';
import { expect } from 'chai';
import { request as expressRequest } from 'express';
import { SubscriptionRequests } from '../../../main/resources/requests/subscriptionRequests';

const PAGE_URL = '/unsubscribe-confirmation';
const validBody = {'unsubscribe-confirm': 'yes', subscription: 'valid subscription'};
let htmlRes: Document;

describe('Unsubscribe Confirmation Page', () => {
  beforeAll(async () => {
    sinon.stub(expressRequest, 'isAuthenticated').returns(true);
    sinon.stub(SubscriptionRequests.prototype, 'unsubscribe').withArgs({...validBody, userId: '1'}).resolves(true);
    app.request['user'] = {id: '1'};

    await request(app).post(PAGE_URL).send(validBody).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
    });
  });

  it('should display confirmation panel component', () => {
    const panel = htmlRes.getElementsByClassName('govuk-panel--confirmation');
    expect(panel.length).to.equal(1);
  });

  it('should display confirmation within the panel', () => {
    const panelTitle = htmlRes.getElementsByClassName('govuk-panel__title');
    const panelMessage = htmlRes.getElementsByClassName('govuk-panel__body');
    expect(panelTitle[0].innerHTML).to.contains('Subscription removed');
    expect(panelMessage[0].innerHTML).to.contains('Your subscription has been removed');
  });

  it('should contain you account url', () => {
    const youAccountLink = htmlRes.getElementsByClassName('govuk-body')[0]
      .getElementsByClassName('govuk-link')[0];
    expect(youAccountLink.innerHTML).to.equal('your account');
    expect(youAccountLink.getAttribute('href')).to.equal('your-account');
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
