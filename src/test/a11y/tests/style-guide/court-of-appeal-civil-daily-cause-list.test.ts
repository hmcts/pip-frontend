import sinon from 'sinon';
import { PublicationService } from '../../../../main/service/PublicationService';
import { testArtefactJsonData, testArtefactMetadata } from '../../common/testData';
import { testAccessibility } from '../../common/pa11yHelper';

const url = '/court-of-appeal-civil-daily-cause-list?artefactId=abc';

const jsonData = testArtefactJsonData('courtOfAppealCivilDailyCauseList.json');
const metadata = testArtefactMetadata()[0];
metadata.listType = 'COURT_OF_APPEAL_CIVIL_DAILY_CAUSE_LIST';

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(jsonData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(metadata);

describe('Accessibility - Court of Appeal (Civil Division) Daily Cause List', () => {
    testAccessibility(url);
});
