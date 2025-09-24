import { request as expressRequest } from 'express';
import request from 'supertest';
import { app } from '../../../../main/app';
import { expect } from 'chai';
import { AuditLogService } from '../../../../main/service/AuditLogService';
import sinon from 'sinon';

const PAGE_URL = '/audit-log-viewer';
const headingClass = 'govuk-heading-l';
const tableHeaderClass = 'govuk-table__header';
const filterHeaderClass = 'govuk-heading-m';
const linkClass = 'govuk-link';
const buttonClass = 'govuk-button';
let htmlRes: Document;

sinon.stub(AuditLogService.prototype, 'getFormattedAuditData').returns({
    auditLogData: 'test',
    paginationData: 'test2',
    emailFieldData: 'test3',
    userIdFieldData: 'test4',
    actionsFieldData: 'test5',
    filterDateFieldData: 'test6',
    categories: 'test8',
});

describe('Audit Log Viewer Page', () => {
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
        expect(header[0].innerHTML).contains('View audit log', 'Could not find the header');
    });

    it('Should display Timestamp in table header', () => {
        const tableHeader = htmlRes.getElementsByClassName(tableHeaderClass);
        expect(tableHeader[0].innerHTML).contains('Timestamp', 'Could not find the header');
    });

    it('Should display Email in table header', () => {
        const tableHeader = htmlRes.getElementsByClassName(tableHeaderClass);
        expect(tableHeader[1].innerHTML).contains('Email', 'Could not find the header');
    });

    it('Should display Action in table header', () => {
        const tableHeader = htmlRes.getElementsByClassName(tableHeaderClass);
        expect(tableHeader[2].innerHTML).contains('Action', 'Could not find the header');
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
