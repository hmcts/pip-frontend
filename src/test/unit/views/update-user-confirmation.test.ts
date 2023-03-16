import sinon from 'sinon';
import request from 'supertest';
import { app } from '../../../main/app';
import { expect } from 'chai';
import { AccountManagementRequests } from '../../../main/resources/requests/accountManagementRequests';
import { request as expressRequest } from 'express';
import { UserManagementService } from '../../../main/service/userManagementService';

const PAGE_URL = '/update-user';
const validBody = { userId: '1234', updatedRole: 'SYSTEM_ADMIN' };
const panelHeadingClass = 'govuk-panel__title';
const panelBodyClass = 'govuk-panel__body';
const linkClass = 'govuk-link';
const listClass = 'govuk-list';
let htmlRes: Document;

sinon.stub(UserManagementService.prototype, 'auditAction').resolves({});
const stub = sinon.stub(AccountManagementRequests.prototype, 'updateUser');
stub.withArgs('1234', 'SYSTEM_ADMIN').resolves(true);

describe('Update User Confirmation Page', () => {
    beforeAll(async () => {
        expressRequest['user'] = { roles: 'SYSTEM_ADMIN' };

        await request(app)
            .post(PAGE_URL)
            .send(validBody)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
            });
    });

    it('should display panel heading', () => {
        const panelHeading = htmlRes.getElementsByClassName(panelHeadingClass);
        expect(panelHeading[0].innerHTML).contains('User Updated', 'Could not find the panel heading');
    });

    it('should display panel body', () => {
        const panelBody = htmlRes.getElementsByClassName(panelBodyClass);
        expect(panelBody[0].innerHTML).contains(
            'This user has been updated to a System Admin. ' +
                'They will need to sign in again for this to take effect',
            'Could not find the panel body'
        );
    });

    it('should display the system admin dashboard link', () => {
        const link = htmlRes.getElementsByClassName(linkClass);
        expect(link[5].innerHTML).contains('system admin dashboard', 'Could not find the dashboard link');
    });

    it('should display the bullet list', () => {
        const list = htmlRes.getElementsByClassName(listClass)[0].getElementsByTagName('li');
        expect(list.length).to.equal(5);
        expect(list[0].innerHTML).contains('upload reference data', 'Could not find bullet list');
        expect(list[1].innerHTML).contains('upload bulk media users', 'Could not find bullet list');
        expect(list[2].innerHTML).contains('extract artefact data', 'Could not find bullet list');
        expect(list[3].innerHTML).contains('edit third party subscriptions', 'Could not find bullet list');
        expect(list[4].innerHTML).contains('manage users', 'Could not find bullet list');
    });
});
