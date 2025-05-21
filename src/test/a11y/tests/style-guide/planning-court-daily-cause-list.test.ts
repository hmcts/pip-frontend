import sinon from 'sinon';
import { PublicationService } from '../../../../main/service/PublicationService';
import { testArtefactJsonData, testArtefactMetadata } from '../../common/testData';
import { testAccessibility } from '../../common/pa11yHelper';

const url = '/planning-court-daily-cause-list?artefactId=abc';

const jsonData = testArtefactJsonData('planningCourtDailyCauseList.json');
const metadata = testArtefactMetadata()[0];
metadata.listType = 'PLANNING_COURT_DAILY_CAUSE_LIST';

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(jsonData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(metadata);

describe('Accessibility - Planning Court Daily Cause List', () => {
    testAccessibility(url);
});
