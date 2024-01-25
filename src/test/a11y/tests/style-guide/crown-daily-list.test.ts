import sinon from 'sinon';
import { PublicationService } from '../../../../main/service/publicationService';
import { LocationRequests } from '../../../../main/resources/requests/locationRequests';
import { testArtefactJsonData, testArtefactMetadata, testLocationData } from '../../common/testData';
import { testAccessibility } from '../../common/pa11yHelper';

const url = '/crown-daily-list?artefactId=abc';

const jsonData = testArtefactJsonData('crownDailyList.json');
const metadata = testArtefactMetadata()[0];
const locationData = testLocationData();

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(jsonData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(metadata);
sinon.stub(LocationRequests.prototype, 'getLocation').resolves(locationData);

describe('Accessibility - Crown Daily List Page', () => {
    testAccessibility(url);
});
