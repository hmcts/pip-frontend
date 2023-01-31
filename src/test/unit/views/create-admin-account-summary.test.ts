import request from 'supertest';
import { app } from '../../../main/app';
import sinon from 'sinon';
import { expect } from 'chai';
import { CreateAccountService } from '../../../main/service/createAccountService';
import { request as expressRequest } from 'express';

const PAGE_URL = '/create-admin-account-summary';
const cookie = {
    firstName: 'joe',
    lastName: 'bloggs',
    emailAddress: 'joebloggs@mail.com',
    'user-role': 'super-admin-ctsc',
    userRoleObject: {
        key: 'super-admin-ctsc',
        text: 'Internal - Super Administrator - CTSC',
        mapping: 'INTERNAL_SUPER_ADMIN_CTSC',
    },
};
const summaryKeys = ['First name', 'Last name', 'Email address', 'User role'];
const changeValues = ['firstName', 'lastName', 'emailAddress', 'user-role'];
let htmlRes: Document;
const createAccountStub = sinon.stub(CreateAccountService.prototype, 'createAdminAccount');

expressRequest['user'] = { roles: 'SYSTEM_ADMIN' };

describe('Create Admin Account Summary page', () => {
    describe('on GET', () => {
        beforeAll(async () => {
            app.request['cookies'] = {
                createAdminAccount: JSON.stringify(cookie),
            };
            await request(app)
                .get(PAGE_URL)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    htmlRes.getElementsByTagName('div')[0].remove();
                });
        });

        it('should display a header', () => {
            const header = htmlRes.getElementsByClassName('govuk-heading-l');
            expect(header[0].innerHTML).contains('Check account details', 'Could not find the header');
        });

        it('should display correct summary keys and actions', async () => {
            const listKeys = htmlRes.getElementsByClassName('govuk-summary-list__key');
            const actions = htmlRes.getElementsByClassName('govuk-summary-list__actions');
            for (let i = 0; i < summaryKeys.length; i++) {
                expect(listKeys[i].innerHTML).to.contain(
                    summaryKeys[i],
                    `Unable to find ${summaryKeys[i]} summary key`
                );
                expect(actions[i].getElementsByClassName('govuk-link')[0].innerHTML).to.contain('Change');
                expect(actions[i].getElementsByClassName('govuk-link')[0].getAttribute('href')).to.equal(
                    `create-admin-account#${changeValues[i]}`
                );
            }
        });

        it('should display correct summary values', async () => {
            const values = htmlRes.getElementsByClassName('govuk-summary-list__value');
            expect(values[0].innerHTML).to.contain(cookie.firstName, 'First name value not found');
            expect(values[1].innerHTML).to.contain(cookie.lastName, 'Last name value not found');
            expect(values[2].innerHTML).to.contain(cookie.emailAddress, 'Email address value not found');
            expect(values[3].innerHTML).to.contain(cookie.userRoleObject.text, 'User role value not found');
        });

        it('should display confirm button', async () => {
            const confirmButton = htmlRes.getElementsByClassName('govuk-button')[0];
            expect(confirmButton.innerHTML).to.contain('Confirm', 'Unable to find confirm button');
        });
    });

    describe('on POST', () => {
        describe('with errors', () => {
            beforeAll(async () => {
                createAccountStub.resolves(false);
                app.request['cookies'] = {
                    createAdminAccount: JSON.stringify(cookie),
                };
                app.request['user'] = {
                    email: 'joe@bloggs.com',
                    roles: 'SYSTEM_ADMIN',
                };
                await request(app)
                    .post(PAGE_URL)
                    .then(res => {
                        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                        htmlRes.getElementsByTagName('div')[0].remove();
                    });
            });

            it('should display error dialog', () => {
                const errorDialog = htmlRes.getElementsByClassName('govuk-error-summary');
                const errorSummaryList = htmlRes.getElementsByClassName('govuk-error-summary__list')[0];
                expect(errorDialog[0].getElementsByClassName('govuk-error-summary__title')[0].innerHTML).contains(
                    'There is a problem',
                    'Could not find error dialog title'
                );
                expect(errorSummaryList.innerHTML).contains(
                    'This email already exists. The user should try signing in using this email or reset their password.'
                );
            });
        });

        describe('with success', () => {
            beforeAll(async () => {
                app.request['user'] = {
                    email: 'joe@bloggs.com',
                    roles: 'SYSTEM_ADMIN',
                };
                createAccountStub.resolves(true);
                app.request['cookies'] = {
                    createAdminAccount: JSON.stringify(cookie),
                };
                await request(app)
                    .post(PAGE_URL)
                    .then(res => {
                        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                        htmlRes.getElementsByTagName('div')[0].remove();
                    });
            });

            it('should not display confirm button', () => {
                const confirmButton = htmlRes.getElementsByClassName('govuk-button');
                expect(confirmButton.length).to.equal(0, 'Confirm button is visible, while it should be hidden');
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
        });
    });
});
