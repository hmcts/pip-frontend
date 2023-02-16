import { getFlowName } from '../../../main/authentication/authRedirect';

describe('Auth Redirect', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    describe('getFlowName', () => {
        it('should return default value if environment variable is not set', () => {
            expect(getFlowName(null)).toEqual('B2C_1_SignInUserFlow');
        });

        it('should return env variable', () => {
            process.env.B2C_FLOW_NAME = 'env_flow_name';
            expect(getFlowName('test')).toEqual(process.env.B2C_FLOW_NAME);
        });
    });
});
