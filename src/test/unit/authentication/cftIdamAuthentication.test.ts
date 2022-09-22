jest.mock('jwt-decode', () => () => ({'roles': 'VERIFIED'}));

import sinon from 'sinon';
import {cftIdamTokenApi} from '../../../main/resources/requests/utils/axiosConfig';
import {cftIdamAuthentication} from '../../../main/authentication/cftIdamAuthentication';
const postStub = sinon.stub(cftIdamTokenApi, 'post');

describe('CFT IDAM Authentication', () => {

  it('Should set up passport correctly for azure authentication', async () => {
    const mockFunction = jest.fn();
    const request = {'query': {'code': '1234'}};
    postStub.resolves({'data': {}});

    await cftIdamAuthentication(request, mockFunction);

    const cftIdamTokenCall = postStub.getCall(0).args;
    expect(cftIdamTokenCall[0]).toEqual('/o/token');
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
});
