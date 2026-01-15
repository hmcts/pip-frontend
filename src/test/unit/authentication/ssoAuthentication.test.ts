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

import { ssoVerifyFunction, getSsoConfig, determineUserRole, handleSsoUser } from '../../../main/authentication/ssoAuthentication';
import { describe } from '@jest/globals';

const graphApiStub = sinon.stub(graphApi, 'post');
graphApiStub.withArgs('/users/1/getMemberObjects').resolves({ data: { value: [systemAdminSecurityGroup] } });
graphApiStub.withArgs('/users/2/getMemberObjects').resolves({ data: { value: [adminCtscSecurityGroup] } });
graphApiStub.withArgs('/users/3/getMemberObjects').resolves({ data: { value: [adminLocalSecurityGroup] } });
graphApiStub.withArgs('/users/4/getMemberObjects').resolves({ data: { value: [] } });
graphApiStub.withArgs('/users/5/getMemberObjects').resolves({ data: { value: [systemAdminSecurityGroup] } });
graphApiStub.withArgs('/users/6/getMemberObjects').resolves({ data: { value: [systemAdminSecurityGroup] } });

const getUserStub = sinon.stub(AccountManagementRequests.prototype, 'getPiUserByAzureOid');
getUserStub.withArgs('1').resolves({ userId: '123', roles: 'SYSTEM_ADMIN' });
getUserStub.withArgs('2').resolves(null);
getUserStub.withArgs('3').resolves({ userId: '124', roles: 'SYSTEM_ADMIN' });
getUserStub.withArgs('4').resolves({ userId: '125', roles: 'INTERNAL_ADMIN_CTSC' });
getUserStub.withArgs('5').resolves({ userId: '126', roles: 'INTERNAL_ADMIN_LOCAL' });
getUserStub.withArgs('6').resolves(null);

const deleteUserStub = sinon.stub(AccountManagementRequests.prototype, 'deleteUser');
deleteUserStub.withArgs('124').resolves('User deleted');
deleteUserStub.withArgs('126').resolves(null);

sinon.stub(AccountManagementRequests.prototype, 'updateUser').resolves('User updated');

let systemAdminStub = sinon
    .stub(AccountManagementRequests.prototype, 'createSystemAdminUser')
    .resolves({ userId: '124', roles: 'SYSTEM_ADMIN' });

sinon
    .stub(AccountManagementRequests.prototype, 'createPIAccount')
    .resolves({ userId: '125', roles: 'INTERNAL_ADMIN_CTSC' });


describe ("SSO Authentication Test", () => {

    afterAll(() => {
        delete process.env.SSO_SG_SYSTEM_ADMIN;
        delete process.env.SSO_SG_ADMIN_CTSC;
        delete process.env.SSO_SG_ADMIN_LOCAL;
    });

    describe('determineUserRole', () => {
        it('should return system admin user role', async () => {
            const response = await determineUserRole('1', [], accessToken);
            expect(response).toEqual('SYSTEM_ADMIN');
        });

        it('should return admin CTSC user role', async () => {
            const response = await determineUserRole('2', [], accessToken);
            expect(response).toEqual('INTERNAL_ADMIN_CTSC');
        });

        it('should return admin local user role', async () => {
            const response = await determineUserRole('3', [], accessToken);
            expect(response).toEqual('INTERNAL_ADMIN_LOCAL');
        });

        it('should return no user role', async () => {
            const response = await determineUserRole('4', [], accessToken);
            expect(response).toBeNull();
        });
    });


    describe('handleSsoUser', () => {

        it('should return PI user if user is found with the same role', async () => {
            const response = await handleSsoUser({ oid: '1', roles: 'SYSTEM_ADMIN' });
            expect(response).toEqual({ userId: '123', roles: 'SYSTEM_ADMIN' });
        });

        it('should return PI user if user is found with different role (system admin)', async () => {
            const response = await handleSsoUser({ oid: '3', roles: 'SYSTEM_ADMIN' });
            expect(response).toEqual({ userId: '124', roles: 'SYSTEM_ADMIN' });
        });

        it('should return PI user if user is found with different role (admin)', async () => {
            const response = await handleSsoUser({ oid: '4', roles: 'INTERNAL_ADMIN_CTSC' });
            expect(response).toEqual({ userId: '125', roles: 'INTERNAL_ADMIN_CTSC' });
        });

        it('should not create system admin if existing user failed to be deleted', async () => {
            const response = await handleSsoUser({ oid: '5', roles: 'SYSTEM_ADMIN' });
            expect(response).toBeNull();
        });

        it('should create system admin PI user if user not found', async () => {
            const response = await handleSsoUser({ oid: '2', roles: 'SYSTEM_ADMIN' });
            expect(response).toEqual({ userId: '124', roles: 'SYSTEM_ADMIN' });
        });

        it('should create admin PI user if user not found', async () => {
            const response = await handleSsoUser({ oid: '2', roles: 'INTERNAL_ADMIN_CTSC' });
            expect(response).toEqual({ userId: '125', roles: 'INTERNAL_ADMIN_CTSC' });
        });

    });

    describe('getSsoConfig', () => {
        it('should return config object with OIDC client, callbackURL, and scope', async () => {
            const result = await getSsoConfig();
            expect(result).toHaveProperty('config', { issuer: 'test-issuer' });
            expect(result).toHaveProperty('callbackURL', 'https://localhost:8080/sso/return');
            expect(result).toHaveProperty('scope', 'openid profile email');
        });
    });

    describe('ssoVerifyFunction', () => {
        let jwtDecodeStub;
        const tokens = {
            id_token: 'mock_id_token',
            access_token: 'mock_access_token',
        };

        afterEach(() => {
            jwtDecodeStub.restore();
        });

        afterAll(() => {
            systemAdminStub.restore();
            systemAdminStub = sinon
                .stub(AccountManagementRequests.prototype, 'createSystemAdminUser')
                .resolves({ userId: '124', roles: 'SYSTEM_ADMIN' });
        })

        it('should call done with profile when user is authorized', async () => {
            const profile = {
                oid: '1',
                preferred_username: 'test-username',
                groups: [],
            };

            jwtDecodeStub = sinon.stub(await import('jwt-decode'), 'jwtDecode').returns({ ...profile });

            const done = jest.fn();
            await ssoVerifyFunction(tokens, done);

            expect(done).toHaveBeenCalledWith(
                null,
                expect.objectContaining({
                    oid: '1',
                    roles: 'SYSTEM_ADMIN',
                    email: 'test-username',
                    flow: 'SSO',
                    created: true,
                })
            );
        });

        it('should call done with null and error message when user is not authorized', async () => {
            const profile = {
                oid: '4',
                preferred_username: 'test-username',
                groups: [],
            };

            jwtDecodeStub = sinon.stub(await import('jwt-decode'), 'jwtDecode').returns({ ...profile });

            const done = jest.fn();
            await ssoVerifyFunction(tokens, done);

            expect(done).toHaveBeenCalledWith(
                null,
                null,
                expect.objectContaining({
                    message: expect.any(String),
                })
            );
        });

        it('should set created to false if handleSsoUser is undefined', async () => {
            const profile = {
                oid: '5',
                preferred_username: 'test-username',
                groups: [],
            };

            jwtDecodeStub = sinon.stub(await import('jwt-decode'), 'jwtDecode').returns({ ...profile });

            const done = jest.fn();
            await ssoVerifyFunction(tokens, done);

            expect(done).toHaveBeenCalledWith(
                null,
                expect.objectContaining({
                    created: false,
                })
            );
        });

        it('should set created to false if handleSsoUser returns error', async () => {
            systemAdminStub.restore();
            systemAdminStub = sinon
                .stub(AccountManagementRequests.prototype, 'createSystemAdminUser')
                .resolves({ error: "This is an error" });

            const profile = {
                oid: '6',
                preferred_username: 'test-username',
                groups: [],
            };

            jwtDecodeStub = sinon.stub(await import('jwt-decode'), 'jwtDecode').returns({ ...profile });

            const done = jest.fn();
            await ssoVerifyFunction(tokens, done);

            expect(done).toHaveBeenCalledWith(
                null,
                expect.objectContaining({
                    created: false,
                })
            );
        });
    });

});
