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
const stub = sinon.stub(hearingRequest, 'getHearingsByCaseName');
const stubCaseReferenceNumberSearch = sinon.stub(hearingRequest, 'getHearingByCaseReferenceNumber');
const urnStub = sinon.stub(hearingRequest, 'getCaseByUrn');
stub.withArgs('my').returns(data);
stub.withArgs('').returns([]);
stub.withArgs('foo').returns([]);
stubCaseReferenceNumberSearch.withArgs('11223344').returns(data);
stubCaseReferenceNumberSearch.withArgs('').returns(null);
stubCaseReferenceNumberSearch.withArgs('foo').returns(null);
urnStub.withArgs('validURN').resolves(data);
urnStub.withArgs('bar').resolves(null);
const caseNameStub = sinon.stub(HearingRequests.prototype, 'getHearingsByCaseName');
const caseNumberStub = sinon.stub(HearingRequests.prototype, 'getHearingByCaseNumber');
caseNameStub.withArgs('my').returns(data);
caseNameStub.withArgs('').returns([]);
caseNameStub.withArgs('foo').returns([]);
caseNumberStub.withArgs('').returns(null);
caseNumberStub.withArgs('foo').returns(null);
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

    it('should return empty list if there are no matching results', async () => {
      expect(await hearingService.getCaseByNumber('foo')).to.deep.equal(null);
    });
  });

  it('should return case for a valid urn', async () => {
    expect(await hearingService.getCaseByURN('validURN')).to.equal(data);
  });

  it('should return null for a invalid urn', async () => {
    expect(await hearingService.getCaseByURN('bar')).to.deep.equal(null);
  });
});
