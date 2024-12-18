import { AuditLogService } from '../../../main/service/AuditLogService';
import sinon from 'sinon';
import { app } from '../../../main/app';
import request from 'supertest';
import { expect } from 'chai';

const PAGE_URL = '/audit-log-viewer';

sinon.stub(AuditLogService.prototype, 'getFormattedAuditData').returns({
    auditLogData: 'test',
    paginationData: 'test2',
    emailFieldData: 'test3',
    userIdFieldData: 'test4',
    actionsFieldData: 'test5',
    filterDateFieldData: 'test6',
    categories: 'test8',
});

sinon.stub(AuditLogService.prototype, 'getTableHeaders').returns('testHeader');

describe('Audit Log Viewer', () => {
    describe('on GET', () => {
        test('should return the audit log viewer page', async () => {
            app.request['user'] = { id: '1', roles: 'SYSTEM_ADMIN' };
            await request(app)
                .get(PAGE_URL)
                .expect(res => expect(res.status).to.equal(200));
        });
    });

    describe('on POST', () => {
        test('should return the audit log viewer page', async () => {
            app.request['user'] = { id: '1', roles: 'SYSTEM_ADMIN' };
            await request(app)
                .post(PAGE_URL)
                .expect(res => expect(res.status).to.equal(302));
        });
    });
});
