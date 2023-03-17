import { request as expressRequest } from 'express';
import request from 'supertest';
import { app } from '../../../main/app';
import { expect } from 'chai';
import { AuditLogService } from '../../../main/service/auditLogService';
import sinon from 'sinon';

const PAGE_URL = '/audit-log-viewer';
const headingClass = 'govuk-heading-l';
const tableHeaderClass = 'govuk-table__header';
let htmlRes: Document;

sinon.stub(AuditLogService.prototype, 'getFormattedAuditData').returns({
    auditLogData: 'test',
    paginationData: 'test2',
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
        expect(header[0].innerHTML).contains('System admin audit log', 'Could not find the header');
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
});
