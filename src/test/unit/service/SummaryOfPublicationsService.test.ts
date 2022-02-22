import sinon from 'sinon';
import {expect} from 'chai';
import {PublicationService} from '../../../main/service/publicationService';
import {PublicationRequests} from '../../../main/resources/requests/PublicationRequests';
import {SummaryOfPublicationsService} from '../../../main/service/summaryOfPublicationsService';

const sopService = new SummaryOfPublicationsService();
const pubService = new PublicationService();
const pubStub = sinon.stub(PublicationRequests.prototype, 'getPublicationsByCourt');
const fileStub = sinon.stub(PublicationRequests.prototype, 'getIndividualPubFile');
const metaStub = sinon.stub(PublicationRequests.prototype, 'getIndividualPubMetadata');
const jsonStub = sinon.stub(PublicationRequests.prototype, 'getIndividualPubJson');

describe('Summary Of Publications Service', () => {
  it('should return a list of publications', async () => {
    pubStub.withArgs(0).resolves('{"item":"listOfPubs"}');
    expect(await sopService.getPublications(0, true)).to.equal('{"item":"listOfPubs"}');
  });
  it('should return metadata', async () => {
    metaStub.withArgs(0).resolves('{"item":"listOfMetadata"}');
    expect(await pubService.getIndivPubMetadata(0, true)).to.equal('{"item":"listOfMetadata"}');
  });
  it('should return file', async () => {
    fileStub.withArgs(0).resolves('{"item":"file"}');
    expect(await pubService.getIndivPubFile(0, true)).to.equal('{"item":"file"}');
  });
  it('should return json', async () => {
    jsonStub.withArgs(0).resolves('{"item":"json"}');
    expect(await pubService.getIndivPubJson(0, true)).to.equal('{"item":"json"}');
  });
});
