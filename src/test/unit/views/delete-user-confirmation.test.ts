import sinon from 'sinon';
import request from 'supertest';
import { app } from '../../../main/app';
import { expect } from 'chai';
import { AccountManagementRequests } from '../../../main/resources/requests/AccountManagementRequests';
import { request as expressRequest } from 'express';
import { v4 as uuidv4 } from 'uuid';

const PAGE_URL = '/delete-user-confirmation';
const validUUID1 = uuidv4();
const validUUID2 = uuidv4();

const deleteSuccessBody = { 'delete-user-confirm': 'yes', user: validUUID1 };
const deleteFailureBody = { 'delete-user-confirm': 'yes', user: validUUID2 };
const panelHeadingClass = 'govuk-panel__title';
const panelBodyClass = 'govuk-panel__body';
const linkClass = 'govuk-link';
const listClass = 'govuk-list';
let htmlRes: Document;

const stub = sinon.stub(AccountManagementRequests.prototype, 'deleteUser');
stub.withArgs(validUUID1).resolves('User deleted');
stub.withArgs(validUUID2).resolves(null);

describe('Delete User Confirmation Page', () => {
    describe('delete user success', () => {
        beforeAll(async () => {
            expressRequest['user'] = { roles: 'SYSTEM_ADMIN' };

            await request(app)
                .post(PAGE_URL)
                .send(deleteSuccessBody)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                });
        });

        it('should display panel heading', () => {
            const panelHeading = htmlRes.getElementsByClassName(panelHeadingClass);
            expect(panelHeading[0].innerHTML).contains('User Deleted', 'Could not find the panel heading');
        });

        it('should display panel body', () => {
            const panelBody = htmlRes.getElementsByClassName(panelBodyClass);
            expect(panelBody[0].innerHTML).contains(
                'All data relating to the user has been deleted, ' + 'including subscriptions for media users.',
                'Could not find the panel body'
            );
        });

        it('should display the dashboard link', () => {
            const link = htmlRes.getElementsByClassName(linkClass);
            expect(link[5].innerHTML).contains('system admin dashboard', 'Could not find the dashboard link');
        });

        it('should display the bullet list points', () => {
            const list = htmlRes.getElementsByClassName(listClass)[0].getElementsByTagName('li');
            expect(list.length).to.equal(5);
            expect(list[0].innerHTML).contains('upload reference data', 'Could not find bullet list');
            expect(list[1].innerHTML).contains('upload bulk media users', 'Could not find bullet list');
            expect(list[2].innerHTML).contains('extract artefact data', 'Could not find bullet list');
            expect(list[3].innerHTML).contains('edit third party subscriptions', 'Could not find bullet list');
            expect(list[4].innerHTML).contains('manage users', 'Could not find bullet list');
        });
    });

    describe('delete user failed', () => {
        beforeAll(async () => {
            expressRequest['user'] = { roles: 'INTERNAL_SUPER_ADMIN_CTSC' };

            await request(app)
                .post(PAGE_URL)
                .send(deleteFailureBody)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                });
        });

        it('should display error heading', () => {
            const heading = htmlRes.getElementsByClassName('govuk-heading-xl');
            expect(heading[0].innerHTML).contains(
                'Sorry, there is a problem with the service',
                'Error heading does not match'
            );
        });
    });
});
