import sinon from 'sinon';
import { dataManagementApi } from '../../../main/resources/requests/utils/axiosConfig';
import { HearingRequests } from '../../../main/resources/requests/hearingRequests';
import fs from 'fs';
import path from 'path';

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
const rawData = fs.readFileSync(path.resolve(__dirname, '../../../main/resources/mocks/caseHearings.json'), 'utf-8');
const subscriptionsData = JSON.parse(rawData);
const hearingMock = subscriptionsData.filter(x=>x.hearingId === 2)[0];
describe('Hearing get requests', () => {
  beforeEach(() => {
    stub.withArgs('/hearings/case-name/').resolves(Promise.reject(errorResponse));
    stub.withArgs('/hearings/case-name/bob').resolves(Promise.reject(errorRequest));
    stub.withArgs('/hearings/case-name/my').resolves({data});
    stub.withArgs('/hearings/2').resolves(hearingMock);

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

  it('should return hearing', async () => {
    expect(await hearingRequests.getHearingsById(2)).toStrictEqual(hearingMock);
  });

  it('should not return hearings', async () => {
    expect(await hearingRequests.getHearingsById(2)).toStrictEqual(hearingMock);
  });
});
