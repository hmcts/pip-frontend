import sinon from 'sinon';
import { PublicationService } from '../../../../main/service/PublicationService';
import { ListDownloadService } from '../../../../main/service/ListDownloadService';
import { testArtefactJsonData, testArtefactMetadata } from '../../common/testData';
import { testAccessibility } from '../../common/pa11yHelper';

const url = '/sjp-public-list?artefactId=abc';

const jsonData = testArtefactJsonData('sjp-public-list.json');
const metadata = testArtefactMetadata()[0];

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(jsonData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(metadata);
sinon.stub(ListDownloadService.prototype, 'showDownloadButton').resolves(true);

describe('Accessibility - SJP Public List Page', () => {
    testAccessibility(url);
});
