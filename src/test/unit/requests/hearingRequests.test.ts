import sinon from 'sinon';
import { dataManagementApi } from '../../../main/resources/requests/utils/axiosConfig';
import { HearingRequests } from '../../../main/resources/requests/hearingRequests';

const hearingRequests = new HearingRequests();
const stub = sinon.stub(dataManagementApi, 'get');

const subscriptionsCaseData = [{caseName: 'John Smith v B&Q PLC', caseNumber: 'ABC12345'}];

const errorResponse = {
  response: {
    data: 'test error',
  },
};
const errorRequest = {
  request: 'test error',
};

const errorMessage = {
  message: 'test',
};

const validCaseNo = 'ABC12345';
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

describe(`getHearingByCaseReferenceNumber(${validCaseNo})`, () => {
  beforeEach(() => {
    stub.withArgs('/hearings/case-number/').resolves(Promise.reject(errorResponse));
    stub.withArgs('/hearings/case-number/fail').resolves(Promise.reject(errorRequest));
    stub.withArgs('/hearings/case-number/ABC12345').resolves({data: subscriptionsCaseData});
  });

  it('should return list of cases', async () => {
    return hearingRequests.getHearingByCaseReferenceNumber(validCaseNo).then(data => {
      expect(data).toBe(subscriptionsCaseData);
    });
  });

  it('should return list of 1 case', () => {
    return hearingRequests.getHearingByCaseReferenceNumber(validCaseNo).then(data => {
      expect((data? 1:0)).toBe(1);
    });
  });

  it('should have mocked object in the cases list', () => {
    return hearingRequests.getHearingByCaseReferenceNumber(validCaseNo).then(data => {
      expect((data === subscriptionsCaseData) ? 1 : 0).toBe(1);
    });
  });

  it('should return empty list if request fails', async () => {
    expect(await hearingRequests.getHearingByCaseReferenceNumber('')).toStrictEqual(null);
  });

  it('should return empty list if request fails', async () => {
    expect(await hearingRequests.getHearingByCaseReferenceNumber('fail')).toStrictEqual(null);
  });
});

describe('non existing subscriptions getHearingByCaseReferenceNumber error request', () => {
  stub.withArgs('/hearings/case-number/12345').resolves(Promise.reject(errorRequest));
  it(`should have only cases for case reference ${validCaseNo}`, () => {
    return hearingRequests.getHearingByCaseReferenceNumber(validCaseNo).then(data => {
      expect((data[0].caseNumber === validCaseNo ? 1 : 0)).toBe(1);
    });
  });
});

describe('non existing subscriptions getHearingByCaseReferenceNumber error request', () => {
  stub.withArgs('/hearings/case-number/12345').resolves(Promise.reject(errorRequest));
  it('should return null list of subscriptions for error request', async () => {
    const userSubscriptions = await hearingRequests.getHearingByCaseReferenceNumber('12345');
    expect(userSubscriptions).toBe(null);
  });
});

describe('non existing subscriptions getHearingByCaseReferenceNumber error response', () => {
  stub.withArgs('/hearings/case-number/12345').resolves(Promise.reject(errorMessage));
  it('should return null list of subscriptions for errored call', async () => {
    const userSubscriptions = await hearingRequests.getHearingByCaseReferenceNumber('12345');
    expect(userSubscriptions).toBe(null);
  });
});
