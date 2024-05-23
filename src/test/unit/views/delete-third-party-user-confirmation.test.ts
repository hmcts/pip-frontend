import { expect } from 'chai';
import { app } from '../../../main/app';
import request from 'supertest';
import sinon from 'sinon';
import { AccountManagementRequests } from '../../../main/resources/requests/AccountManagementRequests';

const thirdPartyUserName = 'test name';
const PAGE_URL = `/delete-third-party-user-confirmation?userId=${thirdPartyUserName}`;

app.request['user'] = {
    roles: 'SYSTEM_ADMIN',
};

sinon.stub(AccountManagementRequests.prototype, 'getUserByUserId').resolves({ provenanceUserId: thirdPartyUserName });

let htmlRes: Document;

describe('Delete third party user confirmation page', () => {
    beforeAll(async () => {
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                htmlRes.getElementsByTagName('div')[0].remove();
            });
    });

    it('should display header', () => {
        const header = htmlRes.getElementsByClassName('govuk-heading-l');
        expect(header[0].innerHTML).contains(
            `Are you sure you want to delete ${thirdPartyUserName}?`,
            'Header does not match'
        );
    });

    it('should display yes radio option', () => {
        const radioButton = htmlRes.getElementsByClassName('govuk-radios__input');
        expect(radioButton[0].outerHTML).contains('yes', 'Could not find the radio button');
    });

    it('should display no radio option', () => {
        const radioButton = htmlRes.getElementsByClassName('govuk-radios__input');
        expect(radioButton[1].outerHTML).contains('no', 'Could not find the radio button');
    });

    it('should display the continue button', () => {
        const button = htmlRes.getElementsByClassName('govuk-button');
        expect(button[0].innerHTML).contains('Continue', 'Could not find the continue button');
    });
});
