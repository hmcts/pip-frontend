import sinon from 'sinon';
import request from 'supertest';
import { app } from '../../../main/app';
import { expect } from 'chai';
import { UserManagementService } from '../../../main/service/userManagementService';
import { request as expressRequest } from 'express';

const PAGE_URL = '/user-management';
const headingClass = 'govuk-heading-l';
const headingCaptionClass = 'govuk-caption-l';
const tableHeaderClass = 'govuk-table__header';
const filterHeaderClass = 'govuk-heading-m';
const linkClass = 'govuk-link';
const buttonClass = 'govuk-button';
let htmlRes: Document;

sinon.stub(UserManagementService.prototype, 'getFormattedData').returns({
    userData: 'test',
    paginationData: 'test2',
    emailFieldData: 'test3',
    userIdFieldData: 'test4',
    userProvenanceIdFieldData: 'test5',
    provenancesFieldData: 'test6',
    rolesFieldData: 'test7',
    categories: 'test8',
});

describe('User Management Page', () => {
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
        expect(header[0].innerHTML).contains('User Management', 'Could not find the header');
    });

    it('should display heading caption', () => {
        const header = htmlRes.getElementsByClassName(headingCaptionClass);
        expect(header[0].innerHTML).contains(
            'Use this page to find, update and delete a user',
            'Could not find the header'
        );
    });

    it('Should display Email in table header', () => {
        const tableHeader = htmlRes.getElementsByClassName(tableHeaderClass);
        expect(tableHeader[0].innerHTML).contains('Email', 'Could not find the header');
    });

    it('Should display Role in table header', () => {
        const tableHeader = htmlRes.getElementsByClassName(tableHeaderClass);
        expect(tableHeader[1].innerHTML).contains('Role', 'Could not find the header');
    });

    it('Should display Provenance in table header', () => {
        const tableHeader = htmlRes.getElementsByClassName(tableHeaderClass);
        expect(tableHeader[2].innerHTML).contains('Provenance', 'Could not find the header');
    });

    it('Should display Filter header', () => {
        const filterHeader = htmlRes.getElementsByClassName(filterHeaderClass);
        expect(filterHeader[1].innerHTML).contains('Filter', 'Could not find the header');
    });

    it('Should display Filter sub header', () => {
        const filterHeader = htmlRes.getElementsByClassName(filterHeaderClass);
        expect(filterHeader[2].innerHTML).contains('Selected filters', 'Could not find the header');
    });

    it('Should display clear filters link', () => {
        const link = htmlRes.getElementsByClassName(linkClass);
        expect(link[5].innerHTML).contains('Clear filters', 'Could not find the link');
    });

    it('Should display the apply filters button', () => {
        const button = htmlRes.getElementsByClassName(buttonClass);
        expect(button[4].innerHTML).contains('Apply filters', 'Could not find the button');
    });
});
