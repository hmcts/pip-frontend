import sinon from 'sinon';
import { PublicationService } from '../../../../main/service/publicationService';
import { LocationRequests } from '../../../../main/resources/requests/locationRequests';
import { testArtefactJsonData, testArtefactMetadata, testLocationData } from '../../common/testData';
import { testAccessibility } from '../../common/pa11yHelper';

const url = '/civil-and-family-daily-cause-list?artefactId=abc';

const jsonData = testArtefactJsonData('civilAndFamilyDailyCauseList.json');
const metadata = testArtefactMetadata()[0];
const locationData = testLocationData();
metadata.listType = 'CIVIL_AND_FAMILY_DAILY_CAUSE_LIST';

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(jsonData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(metadata);
sinon.stub(LocationRequests.prototype, 'getLocation').resolves(locationData);

describe('Accessibility - Civil and Family Daily Cause List Page', () => {
    testAccessibility(url);
});
