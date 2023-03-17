import { AuditLogService } from '../../main/service/auditLogService';
import sinon from 'sinon';
import { app } from '../../main/app';
import request from 'supertest';
import { expect } from 'chai';

const PAGE_URL = '/audit-log-details';

sinon.stub(AuditLogService.prototype, 'buildAuditLogDetailsSummaryList').returns({
    rows: [
        {
            key: { text: 'key' },
            value: { text: 'value' },
        },
    ],
});

describe('Audit Log Details', () => {
    describe('on GET', () => {
        test('should return the audit log details page', async () => {
            app.request['user'] = { id: '1', roles: 'SYSTEM_ADMIN' };
            await request(app)
                .get(PAGE_URL)
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
