import request from 'supertest';
import { app } from '../../../main/app';
import { expect } from 'chai';

let htmlRes: Document;

describe('CFT rejected login page', () => {
    beforeAll(async () => {
        const PAGE_URL = '/cft-rejected-login';
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
            });
    });

    it('should display paragraph 1 text', () => {
        const bodyText = htmlRes.getElementsByClassName('govuk-body');
        expect(bodyText[4].innerHTML).contains(
            'You have successfully signed into your MyHMCTS account. Unfortunately, your account role does not allow you to access the verified user part of the Court and tribunal hearings service',
            'Could not find body text'
        );
    });

    it('should display paragraph 2 text', () => {
        const bodyText = htmlRes.getElementsByClassName('govuk-body');
        expect(bodyText[5].innerHTML).contains(
            'Solicitors and other legal professionals are the only users allowed to sign in with a MyHMCTS account. For more information about MyHMCTS the link below:',
            'Could not find body text'
        );
    });

    it('should display paragraph 3 text', () => {
        const bodyText = htmlRes.getElementsByClassName('govuk-body');
        expect(bodyText[7].innerHTML).contains(
            'Alternatively, please click Home to return to the public version of the Court and tribunals hearings Service.',
            'Could not find body text'
        );
    });

    it('should display the link', () => {
        const link = htmlRes.getElementsByClassName('govuk-link');
        expect(link[3].textContent).contains(
            'MyHMCTS: online case management for legal professionals',
            'Could not find link'
        );
        expect(link[3].outerHTML).contains(
            'https://www.gov.uk/guidance/myhmcts-online-case-management-for-legal-professionals',
            'Could not find href in link'
        );
    });
});
