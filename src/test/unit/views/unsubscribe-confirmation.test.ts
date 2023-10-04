import request from 'supertest';
import sinon from 'sinon';
import { app } from '../../../main/app';
import { expect } from 'chai';
import { SubscriptionService } from '../../../main/service/subscriptionService';

const PAGE_URL = '/unsubscribe-confirmation';
const validBody = { 'unsubscribe-confirm': 'yes', subscription: '123' };
let htmlRes: Document;

const pageTitleValue = 'Subscription removed';

app.request['user'] = { roles: 'VERIFIED' };

describe('Unsubscribe Confirmation Page', () => {
    beforeAll(async () => {
        sinon.stub(SubscriptionService.prototype, 'unsubscribe').resolves(true);

        await request(app)
            .post(PAGE_URL)
            .send(validBody)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                htmlRes.getElementsByTagName('div')[0].remove();
            });
    });

    it('should have correct page title', () => {
        const pageTitle = htmlRes.title;
        expect(pageTitle).contains(pageTitleValue, 'Page title does not match header');
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
        const youAccountLink = htmlRes.getElementsByClassName('govuk-body')[0].getElementsByClassName('govuk-link')[0];
        expect(youAccountLink.innerHTML).to.equal('your account');
        expect(youAccountLink.getAttribute('href')).to.equal('account-home');
    });

    it('should display an unordered list with three elements', () => {
        const listElements = htmlRes.getElementsByClassName('govuk-list--bullet')[0].getElementsByTagName('li');
        expect(listElements.length).to.equal(3);
    });

    it('should display unordered list with add a new email subscription', () => {
        const listElements = htmlRes.getElementsByClassName('govuk-list--bullet')[0].getElementsByTagName('li');

        const anchor = listElements[0].getElementsByTagName('a')[0];
        expect(anchor.getAttribute('href')).to.equal('/subscription-add');
        expect(anchor.innerHTML).to.equal('add a new email subscription');
    });

    it('should display unordered list with manage your email subscriptions', () => {
        const listElements = htmlRes.getElementsByClassName('govuk-list--bullet')[0].getElementsByTagName('li');

        const anchor = listElements[1].getElementsByTagName('a')[0];
        expect(anchor.getAttribute('href')).to.equal('/subscription-management');
        expect(anchor.innerHTML).to.equal('manage your current email subscriptions');
    });

    it('should display unordered list with find a court or tribunal', () => {
        const listElements = htmlRes.getElementsByClassName('govuk-list--bullet')[0].getElementsByTagName('li');
        const anchor = listElements[2].getElementsByTagName('a')[0];
        expect(anchor.getAttribute('href')).to.equal('/search');
        expect(anchor.innerHTML).to.equal('find a court or tribunal');
    });
});
