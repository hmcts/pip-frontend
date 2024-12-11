import { graphApi } from '../../../main/resources/requests/utils/axiosConfig';
import sinon from 'sinon';
import process from 'process';
import { AccountManagementRequests } from '../../../main/resources/requests/AccountManagementRequests';

const systemAdminSecurityGroup = '1111';
const adminLocalSecurityGroup = '1112';
const adminCtscSecurityGroup = '1113';
const accessToken = '123';

process.env.SSO_SG_SYSTEM_ADMIN = systemAdminSecurityGroup;
process.env.SSO_SG_ADMIN_CTSC = adminCtscSecurityGroup;
process.env.SSO_SG_ADMIN_LOCAL = adminLocalSecurityGroup;

import { SsoAuthentication } from '../../../main/authentication/ssoAuthentication';

const ssoAuthentication = new SsoAuthentication();

const graphApiStub = sinon.stub(graphApi, 'post');
graphApiStub.withArgs('/users/1/getMemberObjects').resolves({ data: { value: [systemAdminSecurityGroup] } });
graphApiStub.withArgs('/users/2/getMemberObjects').resolves({ data: { value: [adminCtscSecurityGroup] } });
graphApiStub.withArgs('/users/3/getMemberObjects').resolves({ data: { value: [adminLocalSecurityGroup] } });
graphApiStub.withArgs('/users/4/getMemberObjects').resolves({ data: { value: [] } });

const getUserStub = sinon.stub(AccountManagementRequests.prototype, 'getPiUserByAzureOid');
getUserStub.withArgs('1').resolves({ userId: '123', roles: 'SYSTEM_ADMIN' });
getUserStub.withArgs('2').resolves(null);
getUserStub.withArgs('3').resolves({ userId: '124', roles: 'SYSTEM_ADMIN' });
getUserStub.withArgs('4').resolves({ userId: '125', roles: 'INTERNAL_ADMIN_CTSC' });
getUserStub.withArgs('5').resolves({ userId: '126', roles: 'INTERNAL_ADMIN_LOCAL' });

const deleteUserStub = sinon.stub(AccountManagementRequests.prototype, 'deleteUser');
deleteUserStub.withArgs('124').resolves('User deleted');
deleteUserStub.withArgs('126').resolves(null);

sinon.stub(AccountManagementRequests.prototype, 'updateUser').resolves('User updated');

sinon
    .stub(AccountManagementRequests.prototype, 'createSystemAdminUser')
    .resolves({ userId: '124', roles: 'SYSTEM_ADMIN' });
sinon
    .stub(AccountManagementRequests.prototype, 'createPIAccount')
    .resolves({ userId: '125', roles: 'INTERNAL_ADMIN_CTSC' });

describe('SSO Authentication', () => {
    it('should return system admin user role', async () => {
        const response = await ssoAuthentication.determineUserRole('1', [], accessToken);
        expect(response).toEqual('SYSTEM_ADMIN');
    });

    it('should return admin CTSC user role', async () => {
        const response = await ssoAuthentication.determineUserRole('2', [], accessToken);
        expect(response).toEqual('INTERNAL_ADMIN_CTSC');
    });

    it('should return admin local user role', async () => {
        const response = await ssoAuthentication.determineUserRole('3', [], accessToken);
        expect(response).toEqual('INTERNAL_ADMIN_LOCAL');
    });

    it('should return no user role', async () => {
        const response = await ssoAuthentication.determineUserRole('4', [], accessToken);
        expect(response).toBeNull();
    });

    it('should return PI user if user is found with the same role', async () => {
        const response = await ssoAuthentication.handleSsoUser({ oid: '1', roles: 'SYSTEM_ADMIN' });
        expect(response).toEqual({ userId: '123', roles: 'SYSTEM_ADMIN' });
    });

    it('should return PI user if user is found with different role (system admin)', async () => {
        const response = await ssoAuthentication.handleSsoUser({ oid: '3', roles: 'SYSTEM_ADMIN' });
        expect(response).toEqual({ userId: '124', roles: 'SYSTEM_ADMIN' });
    });

    it('should return PI user if user is found with different role (admin)', async () => {
        const response = await ssoAuthentication.handleSsoUser({ oid: '4', roles: 'INTERNAL_ADMIN_CTSC' });
        expect(response).toEqual({ userId: '125', roles: 'INTERNAL_ADMIN_CTSC' });
    });

    it('should not create system admin if existing user failed to be deleted', async () => {
        const response = await ssoAuthentication.handleSsoUser({ oid: '5', roles: 'SYSTEM_ADMIN' });
        expect(response).toBeNull();
    });

    it('should create system admin PI user if user not found', async () => {
        const response = await ssoAuthentication.handleSsoUser({ oid: '2', roles: 'SYSTEM_ADMIN' });
        expect(response).toEqual({ userId: '124', roles: 'SYSTEM_ADMIN' });
    });

    it('should create admin PI user if user not found', async () => {
        const response = await ssoAuthentication.handleSsoUser({ oid: '2', roles: 'INTERNAL_ADMIN_CTSC' });
        expect(response).toEqual({ userId: '125', roles: 'INTERNAL_ADMIN_CTSC' });
    });

    afterAll(() => {
        delete process.env.SSO_SG_SYSTEM_ADMIN;
        delete process.env.SSO_SG_ADMIN_CTSC;
        delete process.env.SSO_SG_ADMIN_LOCAL;
    });
});
