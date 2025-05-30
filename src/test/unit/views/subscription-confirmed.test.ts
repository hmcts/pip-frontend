import { app } from '../../../main/app';
import { expect } from 'chai';
import request from 'supertest';

const PAGE_URL = '/subscription-confirmed';
let htmlRes: Document;

describe('Subscriptions Confirmed Page', () => {
    beforeAll(async () => {
        app.request['user'] = { userId: '1', roles: 'VERIFIED' };
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                htmlRes.getElementsByTagName('div')[0].remove();
            });
    });

    it('should have correct page title', () => {
        const pageTitle = htmlRes.title;
        expect(pageTitle).contains(
            'Add email subscription - Subscription confirmation - Court and Tribunal Hearings - GOV.UK',
            'Page title does not match'
        );
    });

    it('should display confirmation panel with correct title and message', () => {
        const panel = htmlRes.getElementsByClassName('govuk-panel--confirmation')[0];
        expect(panel.getElementsByClassName('govuk-panel__title')[0].innerHTML).contains(
            'Email subscriptions updated',
            'Could not find panel title or is incorrect'
        );
        expect(panel.getElementsByClassName('govuk-panel__body').length).equal(
            0,
            'Could not find panel message or is incorrect'
        );
    });

    it('should contain you account url', () => {
        const youAccountLink = htmlRes.getElementsByClassName('govuk-body')[0].getElementsByTagName('a')[0];
        expect(youAccountLink.innerHTML).to.equal('your account');
        expect(youAccountLink.getAttribute('href')).to.equal('/account-home');
    });

    it('should display an unordered list with three elements', () => {
        const listElements = htmlRes.getElementsByClassName('govuk-list--bullet')[0].getElementsByTagName('li');
        expect(listElements.length).to.equal(4);
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

    it('should display unordered list with which list type to receive', () => {
        const listElements = htmlRes.getElementsByClassName('govuk-list--bullet')[0].getElementsByTagName('li');
        const anchor = listElements[3].getElementsByTagName('a')[0];
        expect(anchor.getAttribute('href')).to.equal('/subscription-configure-list');
        expect(anchor.innerHTML).to.equal('select which list type to receive');
    });
});
