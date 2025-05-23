import sinon from 'sinon';
import { PublicationService } from '../../../../main/service/PublicationService';
import { testArtefactJsonData, testArtefactMetadata } from '../../common/testData';
import { testAccessibility } from '../../common/pa11yHelper';

const url = '/bristol-and-cardiff-administrative-court-daily-cause-list?artefactId=abc';

const jsonData = testArtefactJsonData('administrativeCourtDailyCauseList.json');
const metadata = testArtefactMetadata()[0];
metadata.listType = 'BRISTOL_AND_CARDIFF_ADMINISTRATIVE_COURT_DAILY_CAUSE_LIST';

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(jsonData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(metadata);

describe('Accessibility - Bristol and Cardiff Administrative Court Daily Cause List', () => {
    testAccessibility(url);
});
