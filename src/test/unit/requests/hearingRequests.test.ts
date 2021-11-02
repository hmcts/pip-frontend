import sinon from 'sinon';
import { dataManagementApi } from '../../../main/resources/requests/utils/axiosConfig';
import { HearingRequests } from '../../../main/resources/requests/hearingRequests';

const hearingRequests = new HearingRequests();
const stub = sinon.stub(dataManagementApi, 'get');
const errorResponse = {
  response: {
    data: 'test error',
  },
};
const errorRequest = {
  request: 'test error',
};
const data = [{caseName: 'my hearing', caseNumber: '11223344'}];

describe('Hearing get requests', () => {
  beforeEach(() => {
    stub.withArgs('/hearings/case-name/').resolves(Promise.reject(errorResponse));
    stub.withArgs('/hearings/case-name/bob').resolves(Promise.reject(errorRequest));
    stub.withArgs('/hearings/case-name/my').resolves({data});
  });

  it('should return hearings list', async () => {
    expect(await hearingRequests.getHearingsByCaseName('my')).toBe(data);
  });

  it('should return empty list if request fails', async () => {
    expect(await hearingRequests.getHearingsByCaseName('')).toStrictEqual([]);
  });

  it('should return empty list if request fails', async () => {
    expect(await hearingRequests.getHearingsByCaseName('bob')).toStrictEqual([]);
  });
});
