import sinon from 'sinon';
import { PublicationService } from '../../../../main/service/PublicationService';
import { LocationRequests } from '../../../../main/resources/requests//LocationRequests';
import { testArtefactJsonData, testArtefactMetadata, testLocationData } from '../../common/testData';
import { testAccessibility } from '../../common/pa11yHelper';

const url = '/et-fortnightly-list?artefactId=abc';

const jsonData = testArtefactJsonData('etFortnightlyList.json');
const metadata = testArtefactMetadata()[0];
const locationData = testLocationData();

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(jsonData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(metadata);
sinon.stub(LocationRequests.prototype, 'getLocation').resolves(locationData);

describe('Accessibility - ET Fortnightly Press List Page', () => {
    testAccessibility(url);
});
