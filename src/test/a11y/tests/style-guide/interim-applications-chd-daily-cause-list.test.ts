import sinon from 'sinon';
import { PublicationService } from '../../../../main/service/PublicationService';
import { testArtefactJsonData, testArtefactMetadata } from '../../common/testData';
import { testAccessibility } from '../../common/pa11yHelper';

const url = '/interim-applications-chd-daily-cause-list?artefactId=abc';

const jsonData = testArtefactJsonData('interimApplicationsChanceryDivisionDailyCauseList.json');
const metadata = testArtefactMetadata()[0];
metadata.listType = 'INTERIM_APPLICATIONS_CHD_DAILY_CAUSE_LIST';

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(jsonData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(metadata);

describe('Accessibility - Interim Applications ChD Daily List', () => {
    testAccessibility(url);
});
