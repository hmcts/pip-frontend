import { request as expressRequest } from 'express';
import request from 'supertest';
import { app } from '../../../main/app';
import { expect } from 'chai';
import { AuditLogService } from '../../../main/service/auditLogService';
import sinon from 'sinon';

const PAGE_URL = '/audit-log-details';

sinon.stub(AuditLogService.prototype, 'buildAuditLogDetailsSummaryList').returns({
    rows: [
        {
            key: { text: 'User ID' },
            value: { text: '123' },
        },
        {
            key: { text: 'Email' },
            value: { text: 'test@test.com' },
        },
        {
            key: { text: 'Role' },
            value: { text: 'CTSC Admin' },
        },
        {
            key: { text: 'Provenance' },
            value: { text: 'B2C' },
        },
        {
            key: { text: 'Action' },
            value: { text: 'audit action' },
        },
        {
            key: { text: 'Details' },
            value: { text: 'audit details' },
        },
    ],
});

let htmlRes: Document;

describe('Audit Log Details Page', () => {
    beforeAll(async () => {
        expressRequest['user'] = { roles: 'SYSTEM_ADMIN' };

        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
            });
    });

    it('should have correct page title', () => {
        const pageTitle = htmlRes.title;
        expect(pageTitle).contains('Audit log details', 'Page title does not match');
    });

    it('should display heading', () => {
        const header = htmlRes.getElementsByClassName('govuk-heading-l');
        expect(header[0].innerHTML).contains('View audit log', 'Header does not match');
    });

    describe('should display summary list', () => {
        let keys;
        let values;

        beforeAll(async () => {
            keys = htmlRes.getElementsByClassName('govuk-summary-list__key');
            values = htmlRes.getElementsByClassName('govuk-summary-list__value');
        });

        it('user ID summary list item', () => {
            expect(keys[0].innerHTML).contains('User ID', 'Summary list item key does not match');
            expect(values[0].innerHTML).contains('123', 'Summary list item value does not match');
        });

        it('email summary list item', () => {
            expect(keys[1].innerHTML).contains('Email', 'Summary list item key does not match');
            expect(values[1].innerHTML).contains('test@test.com', 'Summary list item value does not match');
        });

        it('role summary list item', () => {
            expect(keys[2].innerHTML).contains('Role', 'Summary list item key does not match');
            expect(values[2].innerHTML).contains('CTSC Admin', 'Summary list item value does not match');
        });

        it('provenance summary list item', () => {
            expect(keys[3].innerHTML).contains('Provenance', 'Summary list item key does not match');
            expect(values[3].innerHTML).contains('B2C', 'Summary list item value does not match');
        });

        it('action summary list item', () => {
            expect(keys[4].innerHTML).contains('Action', 'Summary list item key does not match');
            expect(values[4].innerHTML).contains('audit action', 'Summary list item value does not match');
        });

        it('details summary list item', () => {
            expect(keys[5].innerHTML).contains('Details', 'Summary list item key does not match');
            expect(values[5].innerHTML).contains('audit details', 'Summary list item value does not match');
        });
    });
});
