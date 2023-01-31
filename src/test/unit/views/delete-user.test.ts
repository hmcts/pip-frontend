import sinon from 'sinon';
import request from 'supertest';
import { app } from '../../../main/app';
import { expect } from 'chai';
import { AccountManagementRequests } from '../../../main/resources/requests/accountManagementRequests';
import { request as expressRequest } from 'express';

const PAGE_URL = '/delete-user?id=1234';
const headingClass = 'govuk-heading-l';
const buttonClass = 'govuk-button';
const radioClass = 'govuk-radios__input';
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

describe('Delete User Page', () => {
    beforeAll(async () => {
        expressRequest['user'] = { roles: 'SYSTEM_ADMIN' };

        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
            });
    });

    it('should display heading', () => {
        const header = htmlRes.getElementsByClassName(headingClass);
        expect(header[0].innerHTML).contains(
            'Are you sure you want to delete test@email.com?',
            'Could not find the header'
        );
    });

    it('should display yes radio option', () => {
        const radioButton = htmlRes.getElementsByClassName(radioClass);
        expect(radioButton[0].outerHTML).contains('yes', 'Could not find the radio button');
    });

    it('should display no radio option', () => {
        const radioButton = htmlRes.getElementsByClassName(radioClass);
        expect(radioButton[1].outerHTML).contains('no', 'Could not find the radio button');
    });

    it('should display the continue button', () => {
        const button = htmlRes.getElementsByClassName(buttonClass);
        expect(button[4].innerHTML).contains('Continue', 'Could not find the continue button');
    });
});
