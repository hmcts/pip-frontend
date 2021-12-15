import sinon from 'sinon';
import { expect } from 'chai';
import { HearingService } from '../../../main/service/hearingService';
import { HearingRequests } from '../../../main/resources/requests/hearingRequests';

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
const hearingService = new HearingService();
const hearingRequest = HearingRequests.prototype;
const caseNameStub = sinon.stub(hearingRequest, 'getHearingsByCaseName');
const caseNumberStub = sinon.stub(hearingRequest, 'getCaseByCaseNumber');
caseNameStub.withArgs('my').returns(data);
caseNameStub.withArgs('').returns([]);
caseNameStub.withArgs('foo').returns([]);
caseNumberStub.withArgs('').returns(null);
caseNumberStub.withArgs('T485913').returns(caseNumberData);

describe('Hearing Service', () => {
  describe('get hearings by case name', () => {
    it('should return hearings list for valid search query', async () => {
      expect(await hearingService.getHearingsByCaseName('my')).to.equal(data);
    });

    it('should return empty list for invalid search', async () => {
      expect(await hearingService.getHearingsByCaseName('')).to.deep.equal([]);
    });

    it('should return empty list if there are no matching results', async () => {
      expect(await hearingService.getHearingsByCaseName('foo')).to.deep.equal([]);
    });
  });

  describe('get case by number', () => {
    it('should return case for valid case number query', async () => {
      expect(await hearingService.getCaseByNumber('T485913')).to.deep.equal(caseNumberData);
    });

    it('should return null for invalid case number query', async () => {
      expect(await hearingService.getCaseByNumber('')).to.equal(null);
    });
  });
});
