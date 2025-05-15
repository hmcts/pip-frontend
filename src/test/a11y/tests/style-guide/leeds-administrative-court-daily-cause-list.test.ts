import sinon from 'sinon';
import { PublicationService } from '../../../../main/service/PublicationService';
import { testArtefactJsonData, testArtefactMetadata } from '../../common/testData';
import { testAccessibility } from '../../common/pa11yHelper';

const url = '/leeds-administrative-court-daily-cause-list?artefactId=abc';

const jsonData = testArtefactJsonData('leedsAdministrativeCourtDailyCauseList.json');
const metadata = testArtefactMetadata()[0];
metadata.listType = 'LEEDS_ADMINISTRATIVE_COURT_DAILY_CAUSE_LIST';

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(jsonData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(metadata);

describe('Accessibility - Leeds Administrative Court Daily Cause List', () => {
    testAccessibility(url);
});
