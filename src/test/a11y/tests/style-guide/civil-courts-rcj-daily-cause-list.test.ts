import sinon from 'sinon';
import { PublicationService } from '../../../../main/service/PublicationService';
import { testArtefactJsonData, testArtefactMetadata } from '../../common/testData';
import { testAccessibility } from '../../common/pa11yHelper';

const url = '/civil-courts-rcj-daily-cause-list?artefactId=abc';

const jsonData = testArtefactJsonData('civilCourtsRcjDailyCauseList.json');
const metadata = testArtefactMetadata()[0];
metadata.listType = 'CIVIL_COURTS_RCJ_DAILY_CAUSE_LIST';

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(jsonData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(metadata);

describe('Accessibility - Civil Courts at the RCJ Daily Cause List', () => {
    testAccessibility(url);
});
