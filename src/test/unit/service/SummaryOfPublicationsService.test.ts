import sinon from 'sinon';
import {expect} from 'chai';
import {SummaryOfPublicationsService} from '../../../main/service/summaryOfPublicationsService';
import {SummaryOfPublicationsRequests} from '../../../main/resources/requests/summaryOfPublicationsRequests';

const sopService = new SummaryOfPublicationsService();
const pubStub = sinon.stub(SummaryOfPublicationsRequests.prototype, 'getListOfPubs');
const fileStub = sinon.stub(SummaryOfPublicationsRequests.prototype, 'getIndividualPubFile');
const metaStub = sinon.stub(SummaryOfPublicationsRequests.prototype, 'getIndividualPubMetadata');
const jsonStub = sinon.stub(SummaryOfPublicationsRequests.prototype, 'getIndividualPubJson');

describe('Summary Of Publications Service', () => {
  it('should return a list of publications', async () => {
    pubStub.withArgs(0).resolves('{"item":"listOfPubs"}');
    expect(await sopService.getPublications(0, true)).to.equal('{"item":"listOfPubs"}');
  });
  it('should return metadata', async () => {
    metaStub.withArgs(0).resolves('{"item":"listOfMetadata"}');
    expect(await sopService.getIndivPubMetadata(0, true)).to.equal('{"item":"listOfMetadata"}');
  });
  it('should return file', async () => {
    fileStub.withArgs(0).resolves('{"item":"file"}');
    expect(await sopService.getIndivPubFile(0, true)).to.equal('{"item":"file"}');
  });
  it('should return json', async () => {
    jsonStub.withArgs(0).resolves('{"item":"json"}');
    expect(await sopService.getIndivPubJson(0, true)).to.equal('{"item":"json"}');
  });
});
