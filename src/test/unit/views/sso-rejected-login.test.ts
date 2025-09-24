import request from 'supertest';
import { app } from '../../../main/app';
import { expect } from 'chai';
import { request as expressRequest } from 'express';
import { ssoNotAuthorised } from '../../../main/helpers/consts';

let htmlRes: Document;

expressRequest['session'] = { messages: [ssoNotAuthorised] };

describe('SSO rejected login page', () => {
    beforeAll(async () => {
        const PAGE_URL = '/sso-rejected-login';
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
            });
    });

    it('should have correct page title', () => {
        const pageTitle = htmlRes.title;
        expect(pageTitle).contains('Account log in - SSO Rejected Login- Court and Tribunal Hearings - GOV.UK', 'Page title does not match header');
    });

    it('should display page header', () => {
        const header = htmlRes.getElementsByClassName('govuk-heading-l');
        expect(header[0].innerHTML).contains('SSO Rejected Login', 'Page header does not match');
    });

    it('should display paragraph text', () => {
        const bodyText = htmlRes.getElementsByClassName('govuk-body');
        expect(bodyText[4].innerHTML).contains(
            'Unfortunately, you do not have an account for the Court and tribunal hearings service admin dashboard. To create an account please use the link below:',
            'Could not find body text'
        );
    });

    it('should display the link', () => {
        const link = htmlRes.getElementsByClassName('govuk-link');
        expect(link[3].textContent).contains('ServiceNow', 'Could not find link');
        expect(link[3].getAttribute('href')).eq(
            'https://mojprod.service-now.com/moj_sp?id=sc_cat_item&table' +
                '=sc_cat_item&sys_id=735b28071bf5921025dc6351f54bcb93',
            'Could not find href in link'
        );
    });
});
