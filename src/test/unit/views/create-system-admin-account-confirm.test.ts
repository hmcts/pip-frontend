import { app } from '../../../main/app';
import request from 'supertest';
import { CreateAccountService } from '../../../main/service/createAccountService';
import sinon from 'sinon';
import { expect } from 'chai';

const PAGE_URL = '/create-system-admin-account-summary';
const createAccountStub = sinon.stub(CreateAccountService.prototype, 'createSystemAdminAccount');
let htmlRes: Document;

const cookie = {
    firstName: 'Test',
    lastName: 'Name',
    emailAddress: 'Email',
    userRoleObject: {
        mapping: 'SYSTEM_ADMIN',
    },
};

const createdAccountResponse = {
    firstName: 'Test',
    lastname: 'Name',
    email: 'EmailAddress',
};

const isDuplicateResponse = {
    firstName: 'Test',
    lastname: 'Name',
    email: 'EmailAddress',
    duplicate: true,
    aboveMaxSystemAdmin: false,
};

const isAboveMaxResponse = {
    firstName: 'Test',
    lastname: 'Name',
    email: 'EmailAddress',
    duplicate: false,
    aboveMaxSystemAdmin: true,
};

const summaryKeys = ['First name', 'Last name', 'Email address'];

describe('Create System Admin Account Summary page', () => {
    describe('Render confirm page with account create', () => {
        beforeAll(async () => {
            createAccountStub.resolves(createdAccountResponse);
            app.request['cookies'] = {
                createAdminAccount: JSON.stringify(cookie),
            };
            app.request['user'] = {
                emails: ['testadminemail'],
                roles: 'SYSTEM_ADMIN',
            };
            await request(app)
                .post(PAGE_URL)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    htmlRes.getElementsByTagName('div')[0].remove();
                });
        });

        it('should display success panel', () => {
            const panelMessage = htmlRes.getElementsByClassName('govuk-panel__title')[0];
            expect(panelMessage.innerHTML).contains('Account has been created', 'Could not find panel message');
        });

        it('should display what happens next message and title', () => {
            const whatNextTitle = htmlRes.getElementsByClassName('govuk-heading-m')[0];
            const whatNextMessage = htmlRes.getElementsByClassName('govuk-body')[0];
            expect(whatNextTitle.innerHTML).contains('What happens next', 'Could not find title');
            expect(whatNextMessage.innerHTML).contains(
                'This account will be created and the applicant will be notified to set up their account.',
                'Could not find a message'
            );
        });

        it('should display correct summary keys and actions', async () => {
            const listKeys = htmlRes.getElementsByClassName('govuk-summary-list__key');
            for (let i = 0; i < summaryKeys.length; i++) {
                expect(listKeys[i].innerHTML).to.contain(
                    summaryKeys[i],
                    `Unable to find ${summaryKeys[i]} summary key`
                );
            }
        });

        it('should display correct summary values', async () => {
            const values = htmlRes.getElementsByClassName('govuk-summary-list__value');
            expect(values[0].innerHTML).to.contain(cookie.firstName, 'First name value not found');
            expect(values[1].innerHTML).to.contain(cookie.lastName, 'Last name value not found');
            expect(values[2].innerHTML).to.contain(cookie.emailAddress, 'Email address value not found');
        });
    });

    describe('Render confirm page with duplicate error', () => {
        beforeAll(async () => {
            createAccountStub.resolves(isDuplicateResponse);
            app.request['cookies'] = {
                createAdminAccount: JSON.stringify(cookie),
            };
            app.request['user'] = {
                emails: ['testadminemail'],
                roles: 'SYSTEM_ADMIN',
            };
            await request(app)
                .post(PAGE_URL)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    htmlRes.getElementsByTagName('div')[0].remove();
                });
        });

        it('should display error title', () => {
            const errorTitle = htmlRes.getElementsByClassName('govuk-error-summary__title')[0];
            expect(errorTitle.innerHTML).contains('Account has been rejected', 'Could not find panel message');
        });

        it('should display error message', () => {
            const errorTitle = htmlRes.getElementsByClassName('govuk-error-summary__body')[0];
            expect(errorTitle.innerHTML).contains(
                'This user already has an account. If the user requires a system admin account, their previous account will need to be deleted first before one can be created.',
                'Could not find panel message'
            );
        });
    });

    describe('Render confirm page with above max system admin error', () => {
        beforeAll(async () => {
            createAccountStub.resolves(isAboveMaxResponse);
            app.request['cookies'] = {
                createAdminAccount: JSON.stringify(cookie),
            };
            app.request['user'] = {
                emails: ['testadminemail'],
                roles: 'SYSTEM_ADMIN',
            };
            await request(app)
                .post(PAGE_URL)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    htmlRes.getElementsByTagName('div')[0].remove();
                });
        });

        it('should display error title', () => {
            const errorTitle = htmlRes.getElementsByClassName('govuk-error-summary__title')[0];
            expect(errorTitle.innerHTML).contains('Account has been rejected', 'Could not find panel message');
        });

        it('should display error message', () => {
            const errorTitle = htmlRes.getElementsByClassName('govuk-error-summary__body')[0];
            expect(errorTitle.innerHTML).contains(
                'The maximum number of System Admin accounts has been reached.',
                'Could not find panel message'
            );
        });
    });
});
