import request from 'supertest';
import { app } from '../../../main/app';
import { expect } from 'chai';

const PAGE_URL = '/bulk-unsubscribe-confirmed';
let htmlRes: Document;

describe('Bulk Unsubscribe Confirmed Page', () => {
    app.request['user'] = { roles: 'VERIFIED' };

    beforeAll(async () => {
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                htmlRes.getElementsByTagName('div')[0].remove();
            });
    });

    it('should have correct page title', () => {
        const pageTitle = htmlRes.title;
        expect(pageTitle).contains('Subscription(s) removed', 'Page title does not match header');
    });

    it('should display confirmation panel component', () => {
        const panel = htmlRes.getElementsByClassName('govuk-panel--confirmation');
        expect(panel.length).to.equal(1);
    });

    it('should display confirmation within the panel', () => {
        const panelTitle = htmlRes.getElementsByClassName('govuk-panel__title');
        const panelMessage = htmlRes.getElementsByClassName('govuk-panel__body');
        expect(panelTitle[0].innerHTML).to.contains('Subscription(s) removed');
        expect(panelMessage[0].innerHTML).to.contains('Your subscription(s) has been removed');
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
