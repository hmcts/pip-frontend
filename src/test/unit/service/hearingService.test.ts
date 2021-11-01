import sinon from 'sinon';
import { expect } from 'chai';
import { HearingService } from '../../../main/service/hearingService';
import { HearingRequests } from '../../../main/resources/requests/hearingRequests';

const data = [{caseName: 'my hearing', caseNumber: '11223344'}];
const hearingService = new HearingService();
const hearingRequest = HearingRequests.prototype;
const stub = sinon.stub(hearingRequest, 'getHearingsByCaseName');
stub.withArgs('my').returns(data);
stub.withArgs('').returns([]);
stub.withArgs('foo').returns([]);

describe('Hearing Service', () => {
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
