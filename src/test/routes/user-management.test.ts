import { expect } from 'chai';
import { app } from '../../main/app';
import request from 'supertest';
import sinon from 'sinon';
import { UserManagementService } from '../../main/service/userManagementService';

const PAGE_URL = '/user-management';

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

sinon.stub(UserManagementService.prototype, 'getTableHeaders').returns('testHeader');

describe('User Management', () => {
    describe('on GET', () => {
        test('should return user management page', async () => {
            app.request['user'] = { id: '1', roles: 'SYSTEM_ADMIN' };
            await request(app)
                .get(PAGE_URL)
                .expect(res => expect(res.status).to.equal(200));
        });
    });
});
