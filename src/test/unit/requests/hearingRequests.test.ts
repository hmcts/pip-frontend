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
const errorMessage = {
  message: 'test',
};

const data = [{caseName: 'my hearing', caseNumber: '11223344'}];
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
    stub.withArgs('/hearings/case-name/my').resolves({data});
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
