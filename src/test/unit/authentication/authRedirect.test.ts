import { getFlowName, getRedirectURL } from '../../../main/authentication/authRedirect';

describe('Auth Redirect', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe('getRedirectURL', () => {
    it('should return default values if environments are not set', () => {
      const encodedReturnUrl = encodeURIComponent('https://localhost:8080/login/return');
      expect(getRedirectURL(null))
        .toEqual('https://pib2csbox.b2clogin.com/pib2csbox.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_SignInUserFlow' +
          '&client_id=c7e6e2c6-c23c-48e8-b9f4-6bad25a95331&nonce=defaultNonce&redirect_uri=' + encodedReturnUrl +
          '&scope=openid&response_type=id_token&prompt=login');
    });

    it('should return valid url if env variables are set', () => {
      process.env.B2C_AUTH_ENDPOINT = 'https://evnvarendpoint';
      process.env.B2C_FLOW_NAME = 'env_flow_name';
      process.env.CLIENT_ID = '123';
      process.env.AUTH_RETURN_URL = 'https://test.com';
      const expectedRedirectUrl = process.env.B2C_AUTH_ENDPOINT+ '?p='
        + process.env.B2C_FLOW_NAME + '&client_id='
        + process.env.CLIENT_ID + '&nonce=defaultNonce&redirect_uri='
        + encodeURIComponent(process.env.AUTH_RETURN_URL) + '&scope=openid&response_type=id_token&prompt=login';
      expect(getRedirectURL('dev')).toEqual(expectedRedirectUrl);
    });
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
