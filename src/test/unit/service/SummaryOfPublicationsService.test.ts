import sinon from 'sinon';
import { expect } from 'chai';
import { PublicationService } from '../../../main/service/publicationService';
import { PublicationRequests } from '../../../main/resources/requests/publicationRequests';
import { SummaryOfPublicationsService } from '../../../main/service/summaryOfPublicationsService';

const userId = '123';
const sopService = new SummaryOfPublicationsService();
const pubService = new PublicationService();
const pubStub = sinon.stub(PublicationRequests.prototype, 'getPublicationsByCourt');
const pubNoMatchStub = sinon.stub(PublicationRequests.prototype, 'getNoMatchPublications');
const fileStub = sinon.stub(PublicationRequests.prototype, 'getIndividualPublicationFile');
const metaStub = sinon.stub(PublicationRequests.prototype, 'getIndividualPublicationMetadata');
const jsonStub = sinon.stub(PublicationRequests.prototype, 'getIndividualPublicationJson');

describe('Summary Of Publications Service', () => {
    it('should return a list of publications', async () => {
        pubStub.withArgs(0).resolves('{"item":"listOfPubs"}');
        expect(await sopService.getPublications(0, userId)).to.equal('{"item":"listOfPubs"}');
    });
    it('should return metadata', async () => {
        metaStub.withArgs(0).resolves('{"item":"listOfMetadata"}');
        expect(await pubService.getIndividualPublicationMetadata(0, userId)).to.equal('{"item":"listOfMetadata"}');
    });
    it('should return file', async () => {
        fileStub.withArgs(0).resolves('{"item":"file"}');
        expect(await pubService.getIndividualPublicationFile(0, userId)).to.equal('{"item":"file"}');
    });
    it('should return json', async () => {
        jsonStub.withArgs(0).resolves('{"item":"json"}');
        expect(await pubService.getIndividualPublicationJson(0, userId)).to.equal('{"item":"json"}');
    });
    it('should return a list of noMatch publications', async () => {
        pubNoMatchStub.resolves('{"item":"listOfPubs"}');
        expect(await sopService.getNoMatchPublications()).to.equal('{"item":"listOfPubs"}');
    });
});
