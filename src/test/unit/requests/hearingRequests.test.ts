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
const errorMessage = {
  message: 'test',
};
const validCaseNo = 'ABC12345';
const data = [{caseName: 'my hearing', caseNumber: '11223344'}];
const validUrn = '123456789';
const invalidUrn = '1234';
const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/subscriptionListResult.json'), 'utf-8');
const caseData = JSON.parse(rawData);
const mockCaseData = [{caseName: 'John Smith v B&Q PLC', caseNumber: 'ABC12345'}];
const caseNumberData = {
  hearingId: 1,
  courtId: 50,
  courtNumber: 1,
  date: '15/11/2021 10:00:00',
  judge: 'His Honour Judge A Morley QC',
  platform: 'In person',
  caseNumber: 'T485913',
  caseName: 'Tom Clancy',
  urn: 'N363N6R4OG',
};

describe('Hearing get requests', () => {
  beforeEach(() => {
    stub.withArgs('/hearings/case-name/').resolves(Promise.reject(errorResponse));
    stub.withArgs('/hearings/case-name/bob').resolves(Promise.reject(errorRequest));
    stub.withArgs('/hearings/case-name/foo').resolves(Promise.reject(errorMessage));
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

  it('should return empty list if message error', async () => {
    expect(await hearingRequests.getHearingsByCaseName('foo')).toStrictEqual([]);
  });
});

describe(`getHearingByCaseReferenceNumber(${validCaseNo})`, () => {
  beforeEach(() => {
    stub.withArgs('/hearings/case-number/').resolves(Promise.reject(errorResponse));
    stub.withArgs('/hearings/case-number/fail').resolves(Promise.reject(errorRequest));
    stub.withArgs('/hearings/case-number/ABC12345').resolves({data: mockCaseData});
    stub.withArgs('/hearings/case-number/').resolves(Promise.reject(errorResponse));
    stub.withArgs('/hearings/case-number/foo').resolves(Promise.reject(errorRequest));
    stub.withArgs('/hearings/case-number/bar').resolves(Promise.reject(errorMessage));
    stub.withArgs('/hearings/case-number/T485913').resolves({data: caseNumberData});
  });

  describe('hearing case name search', () => {
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

  describe('hearing case number search', () => {
    it('should return valid case', async () => {
      expect(await hearingRequests.getHearingByCaseNumber('T485913')).toBe(caseNumberData);
    });

    it('should return null if request fails', async () => {
      expect(await hearingRequests.getHearingByCaseNumber('foo')).toBe(null);
    });

    it('should return null if response fails', async () => {
      expect(await hearingRequests.getHearingByCaseNumber('')).toBe(null);
    });

    it('should return null if call message', async () => {
      expect(await hearingRequests.getHearingByCaseNumber('bar')).toBe(null);
    });
  });
});

describe('get case by unique reference number', () => {
  beforeEach(async () => {
    stub.withArgs('/hearings/urn/123456789').resolves({data:caseData});
    stub.withArgs(`/hearings/urn/${invalidUrn}`).resolves({data:null});
    stub.withArgs('/hearings/urn/12345').resolves(Promise.reject(errorRequest));
    stub.withArgs('/hearings/urn/123456').resolves(Promise.reject(errorResponse));
    stub.withArgs('/hearings/urn/1234567').resolves(Promise.reject(errorMessage));
  });

  it('should return case matching the urn', async () => {
    const requestData = await hearingRequests.getCaseByUrn(validUrn);
    expect(requestData.urn).toEqual(validUrn);
  });

  it('should return null for non existing urn', async () => {
    const requestData = await hearingRequests.getCaseByUrn(invalidUrn);
    expect(requestData).toBe(null);
  });

  it('should return null for error request', async () => {
    const requestData = await hearingRequests.getCaseByUrn('12345');
    expect(requestData).toBe(null);
  });

  it('should return null for error response', async () => {
    const requestData = await hearingRequests.getCaseByUrn('123456');
    expect(requestData).toBe(null);
  });

  it('should return null for error message', async () => {
    const requestData = await hearingRequests.getCaseByUrn('1234567');
    expect(requestData).toBe(null);
  });
});

