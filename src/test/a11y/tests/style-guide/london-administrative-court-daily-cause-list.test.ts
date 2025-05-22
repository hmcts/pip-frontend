import sinon from 'sinon';
import { PublicationService } from '../../../../main/service/PublicationService';
import { testArtefactJsonData, testArtefactMetadata } from '../../common/testData';
import { testAccessibility } from '../../common/pa11yHelper';

const url = '/london-administrative-court-daily-cause-list?artefactId=abc';

const jsonData = testArtefactJsonData('londonAdministrativeCourtDailyCauseList.json');
const metadata = testArtefactMetadata()[0];
metadata.listType = 'LONDON_ADMINISTRATIVE_COURT_DAILY_CAUSE_LIST';

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(jsonData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(metadata);

describe('Accessibility - London Administrative Court Daily Cause List', () => {
    testAccessibility(url);
});
