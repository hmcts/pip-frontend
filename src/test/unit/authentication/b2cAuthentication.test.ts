import { jwtDecode } from 'jwt-decode';
import * as b2cAuth from '../../../main/authentication/b2cAuthentication';
import * as accountManagementRequests from '../../../main/resources/requests/AccountManagementRequests';

jest.mock('openid-client');
jest.mock('jwt-decode');
jest.mock('../../../main/resources/requests/AccountManagementRequests');

const mockJwtDecode = jwtDecode as jest.Mock;
const mockGetPiUserByAzureOid = accountManagementRequests.AccountManagementRequests.prototype
    .getPiUserByAzureOid as jest.Mock;

describe('b2cAuthentication', () => {
    describe('getB2cConfig', () => {
        it('should return config object with callbackURL and scope', async () => {
            const result = await b2cAuth.getB2cConfig();
            expect(result.config).toEqual({ issuer: 'test-issuer' });
            expect(result.callbackURL).toBeDefined();
            expect(result.scope).toContain('openid');
        });
    });

    describe('getB2cMediaVerificationConfig', () => {
        it('should return media verification config object', async () => {
            const result = await b2cAuth.getB2cMediaVerificationConfig();
            expect(result.config).toEqual({ issuer: 'test-issuer' });
            expect(result.callbackURL).toBeDefined();
            expect(result.scope).toContain('openid');
        });
    });

    describe('piAadVerifyFunction', () => {
        const tokens = { id_token: 'fake-token' };

        it('should call done with profile if user found', async () => {
            const done = jest.fn();
            mockJwtDecode.mockReturnValue({ oid: 'user-oid' });
            mockGetPiUserByAzureOid.mockResolvedValue({
                roles: ['role1'],
                userProvenance: 'provenance',
            });

            await b2cAuth.piAadVerifyFunction(tokens, done);

            expect(done).toHaveBeenCalledWith(
                null,
                expect.objectContaining({
                    roles: ['role1'],
                    userProvenance: 'provenance',
                    oid: 'user-oid',
                })
            );
        });

        it('should call done with null if user not found', async () => {
            const done = jest.fn();
            mockJwtDecode.mockReturnValue({ oid: 'user-oid' });
            mockGetPiUserByAzureOid.mockResolvedValue(null);

            await b2cAuth.piAadVerifyFunction(tokens, done);

            expect(done).toHaveBeenCalledWith(null, null);
        });
    });
});
