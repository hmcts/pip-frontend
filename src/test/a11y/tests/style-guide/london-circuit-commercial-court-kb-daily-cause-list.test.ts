import sinon from 'sinon';
import { PublicationService } from '../../../../main/service/PublicationService';
import { LocationRequests } from '../../../../main/resources/requests/LocationRequests';
import { testArtefactJsonData, testArtefactMetadata, testLocationData } from '../../common/testData';
import { testAccessibility } from '../../common/pa11yHelper';

const url = '/london-circuit-commercial-court-kb-daily-cause-list?artefactId=abc';

const jsonData = testArtefactJsonData('londonCircuitCommercialCourtKbDailyCauseList.json');
const metadata = testArtefactMetadata()[0];
const locationData = testLocationData();
metadata.listType = 'LONDON_CIRCUIT_COMMERCIAL_COURT_KB_DAILY_CAUSE_LIST';

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(jsonData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(metadata);
sinon.stub(LocationRequests.prototype, 'getLocation').resolves(locationData);

describe('Accessibility - London Circuit Commercial Court (KB) Daily Cause List Page', () => {
    testAccessibility(url);
});
