import sinon from 'sinon';
import { PublicationService } from '../../../../main/service/PublicationService';
import { testArtefactJsonData, testArtefactMetadata } from '../../common/testData';
import { testAccessibility } from '../../common/pa11yHelper';

const url = '/family-division-high-court-daily-cause-list?artefactId=abc';

const jsonData = testArtefactJsonData('familyDivisionHighCourtDailyCauseList.json');
const metadata = testArtefactMetadata()[0];
metadata.listType = 'FAMILY_DIVISION_HIGH_COURT_DAILY_CAUSE_LIST';

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(jsonData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(metadata);

describe('Accessibility - Family Division of the High Court Daily Cause List', () => {
    testAccessibility(url);
});
