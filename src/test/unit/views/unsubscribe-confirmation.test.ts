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

    it('should display unordered list with 3 elements with correct values', () => {
        const listElements = htmlRes.getElementsByClassName('govuk-list--bullet')[0].getElementsByTagName('li');
        expect(listElements.length).to.equal(3);
        expect(listElements[0].innerHTML).to.equal('add a new subscription');
        expect(listElements[1].innerHTML).to.equal('manage your current subscriptions');
        expect(listElements[2].innerHTML).to.equal('find a court or tribunal');
    });
});
