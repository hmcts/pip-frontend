import * as querystring from 'querystring';

jest.mock('jwt-decode', () => () => ({'roles': 'VERIFIED'}));

import sinon from 'sinon';
import {cftIdamTokenApi} from '../../../main/resources/requests/utils/axiosConfig';
import {cftIdamAuthentication} from '../../../main/authentication/cftIdamAuthentication';
const postStub = sinon.stub(cftIdamTokenApi, 'post');

describe('CFT IDAM Authentication', () => {

  it('should call the callback when successful', async () => {
    const mockFunction = jest.fn();
    const request = {'query': {'code': '1234'}};
    postStub.resolves({'data': {}});

    const params = {
      client_id: 'app-pip-frontend',
      client_secret: 'client-secret',
      grant_type: 'authorization_code',
      redirect_uri: 'https://localhost:8080/cft-login/return',
      code: '1234',
    };

    await cftIdamAuthentication(request, mockFunction);

    const cftIdamTokenCall = postStub.getCall(0).args;
    expect(cftIdamTokenCall[0]).toEqual('/o/token');
    expect(cftIdamTokenCall[1]).toEqual(querystring.stringify(params));
    expect(cftIdamTokenCall[2]).toEqual({
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    expect(mockFunction.mock.calls.length).toBe(1);
    expect(mockFunction.mock.calls[0][0]).toBe(null);
    expect(mockFunction.mock.calls[0][1]).toEqual({'roles': 'VERIFIED', 'flow': 'CFT'});
  });

  it('Should call the callback with null when throwing an error', async () => {
    const mockFunction = jest.fn();
    const request = {'query': {'code': '1234'}};
    postStub.throws(new Error('CFT IDAM Callback Error'));

    await cftIdamAuthentication(request, mockFunction);

    expect(mockFunction.mock.calls.length).toBe(1);
    expect(mockFunction.mock.calls[0][0]).toBe(null);
    expect(mockFunction.mock.calls[0][1]).toBe(null);
  });

});
