import sinon from 'sinon';
import request from 'supertest';
import { app } from '../../../main/app';
import { expect } from 'chai';
import { AccountManagementRequests } from '../../../main/resources/requests/accountManagementRequests';

const PAGE_URL = '/manage-user?id=1234';
const headingClass = 'govuk-heading-l';
const warningTextClass = 'govuk-warning-text__text';
const summaryTextListKeyClass = 'govuk-summary-list__key';
const summaryTextListValueClass = 'govuk-summary-list__value';
const buttonClass = 'govuk-button';
const linkClass = 'govuk-link';
let htmlRes: Document;

sinon.stub(AccountManagementRequests.prototype, 'getUserByUserId').resolves({
    userId: '1234',
    userProvenance: 'PI_AAD',
    provenanceUserId: '4dcea424-03ed-43d6-88b8-a99ce8159da2',
    email: 'test@email.com',
    roles: 'INTERNAL_SUPER_ADMIN_CTSC',
    createdDate: '2022-11-05T18:45:37.720216',
    lastSignedInDate: '2022-11-07T18:45:37.720216',
});

describe('Manage User Page', () => {
    beforeAll(async () => {
        app.request['user'] = { userId: '1', roles: 'SYSTEM_ADMIN' };

        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
            });
    });

    it('should display heading', () => {
        const header = htmlRes.getElementsByClassName(headingClass);
        expect(header[0].innerHTML).contains('Manage  test@email.com', 'Could not find the header');
    });

    it('should display warning text', () => {
        const warningText = htmlRes.getElementsByClassName(warningTextClass);
        expect(warningText[0].innerHTML).contains(
            'Ensure authorisation has been granted before updating this user',
            'Could not find the warning text'
        );
    });

    it('should display summary text key - User ID', () => {
        const summaryTextKey = htmlRes.getElementsByClassName(summaryTextListKeyClass);
        expect(summaryTextKey[0].innerHTML).contains('User ID', 'Could not find summary text key');
    });

    it('should display summary text value - User ID', () => {
        const summaryTextValue = htmlRes.getElementsByClassName(summaryTextListValueClass);
        expect(summaryTextValue[0].innerHTML).contains('1234', 'Could not find summary text value');
    });

    it('should display summary text key - Email', () => {
        const summaryTextKey = htmlRes.getElementsByClassName(summaryTextListKeyClass);
        expect(summaryTextKey[1].innerHTML).contains('Email', 'Could not find summary text key');
    });

    it('should display summary text value - Email', () => {
        const summaryTextValue = htmlRes.getElementsByClassName(summaryTextListValueClass);
        expect(summaryTextValue[1].innerHTML).contains('test@email.com', 'Could not find summary text value');
    });

    it('should display summary text key - Role', () => {
        const summaryTextKey = htmlRes.getElementsByClassName(summaryTextListKeyClass);
        expect(summaryTextKey[2].innerHTML).contains('Role', 'Could not find summary text key');
    });

    it('should display summary text value - Role', () => {
        const summaryTextValue = htmlRes.getElementsByClassName(summaryTextListValueClass);
        expect(summaryTextValue[2].innerHTML).contains('CTSC Super Admin', 'Could not find summary text value');
    });

    it('should display summary text change link - Role', () => {
        const link = htmlRes.getElementsByClassName(linkClass);
        expect(link[5].innerHTML).contains('Change', 'Could not find summary text change link');
    });

    it('should display summary text key - Provenance', () => {
        const summaryTextKey = htmlRes.getElementsByClassName(summaryTextListKeyClass);
        expect(summaryTextKey[3].innerHTML).contains('Provenance', 'Could not find summary text key');
    });

    it('should display summary text value - Provenance', () => {
        const summaryTextValue = htmlRes.getElementsByClassName(summaryTextListValueClass);
        expect(summaryTextValue[3].innerHTML).contains('B2C', 'Could not find summary text value');
    });

    it('should display summary text key - Provenance ID', () => {
        const summaryTextKey = htmlRes.getElementsByClassName(summaryTextListKeyClass);
        expect(summaryTextKey[4].innerHTML).contains('Provenance ID', 'Could not find summary text key');
    });

    it('should display summary text value - Provenance ID', () => {
        const summaryTextValue = htmlRes.getElementsByClassName(summaryTextListValueClass);
        expect(summaryTextValue[4].innerHTML).contains(
            '4dcea424-03ed-43d6-88b8-a99ce8159da2',
            'Could not find summary text value'
        );
    });

    it('should display summary text key - Creation Date', () => {
        const summaryTextKey = htmlRes.getElementsByClassName(summaryTextListKeyClass);
        expect(summaryTextKey[5].innerHTML).contains('Creation Date', 'Could not find summary text key');
    });

    it('should display summary text value - Creation Date', () => {
        const summaryTextValue = htmlRes.getElementsByClassName(summaryTextListValueClass);
        expect(summaryTextValue[5].innerHTML).contains('05/11/2022 18:45:37', 'Could not find summary text value');
    });

    it('should display summary text key - Last Sign In', () => {
        const summaryTextKey = htmlRes.getElementsByClassName(summaryTextListKeyClass);
        expect(summaryTextKey[6].innerHTML).contains('Last Sign In', 'Could not find summary text key');
    });

    it('should display summary text value - Last Sign In', () => {
        const summaryTextValue = htmlRes.getElementsByClassName(summaryTextListValueClass);
        expect(summaryTextValue[6].innerHTML).contains('07/11/2022 18:45:37', 'Could not find summary text value');
    });

    it('should display the delete user button', () => {
        const button = htmlRes.getElementsByClassName(buttonClass);
        expect(button[4].innerHTML).contains('Delete user', 'Could not find the delete user button');
    });
});
