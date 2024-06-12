import { graphApi } from '../../../main/resources/requests/utils/axiosConfig';
import sinon from 'sinon';
import process from 'process';
import { AccountManagementRequests } from '../../../main/resources/requests/AccountManagementRequests';
import { SsoAuthentication } from '../../../main/authentication/ssoAuthentication';

const systemAdminSecurityGroup = '1111';
const superAdminSecurityGroup = '1112';
const adminSecurityGroup = '1113';
const accessToken = '123';

const ssoAuthentication = new SsoAuthentication();

const graphApiStub = sinon.stub(graphApi, 'post');
graphApiStub.withArgs('/users/1/getMemberObjects').resolves({ data: { value: [systemAdminSecurityGroup] } });
graphApiStub.withArgs('/users/2/getMemberObjects').resolves({ data: { value: [superAdminSecurityGroup] } });
graphApiStub.withArgs('/users/3/getMemberObjects').resolves({ data: { value: [adminSecurityGroup] } });

const getUserStub = sinon.stub(AccountManagementRequests.prototype, 'getPiUserByAzureOid');
getUserStub.withArgs('1').resolves({ userId: '123', roles: 'SYSTEM_ADMIN' });
getUserStub.withArgs('2').resolves(null);

sinon
    .stub(AccountManagementRequests.prototype, 'createSystemAdminUser')
    .resolves({ userId: '124', roles: 'SYSTEM_ADMIN' });
sinon
    .stub(AccountManagementRequests.prototype, 'createPIAccount')
    .resolves({ userId: '125', roles: 'INTERNAL_ADMIN_CTSC' });

describe('SSO Authentication', () => {
    process.env.SSO_SG_SYSTEM_ADMIN = systemAdminSecurityGroup;
    process.env.SSO_SG_SUPER_ADMIN_CTSC = superAdminSecurityGroup;
    process.env.SSO_SG_ADMIN_CTSC = adminSecurityGroup;

    it('should return system admin user role', async () => {
        const response = await ssoAuthentication.determineUserRole('1', accessToken);
        expect(response).toEqual('SYSTEM_ADMIN');
    });

    it('should return super admin user role', async () => {
        const response = await ssoAuthentication.determineUserRole('2', accessToken);
        expect(response).toEqual('INTERNAL_SUPER_ADMIN_CTSC');
    });

    it('should return admin user role', async () => {
        const response = await ssoAuthentication.determineUserRole('3', accessToken);
        expect(response).toEqual('INTERNAL_ADMIN_CTSC');
    });

    it('should return PI user if found', async () => {
        const response = await ssoAuthentication.handleSsoUser({ oid: '1', roles: 'SYSTEM_ADMIN' });
        expect(response).toEqual({ userId: '123', roles: 'SYSTEM_ADMIN' });
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
        delete process.env.SSO_SG_SUPER_ADMIN_CTSC;
        delete process.env.SSO_SG_ADMIN_CTSC;
    });
});
