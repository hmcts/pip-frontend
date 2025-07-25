import sinon from 'sinon';
import { PublicationService } from '../../../../main/service/PublicationService';
import { testArtefactJsonData, testArtefactMetadata } from '../../common/testData';
import { testAccessibility } from '../../common/pa11yHelper';

const url = '/send-daily-hearing-list?artefactId=abc';

const jsonData = testArtefactJsonData('sendDailyHearingList.json');
const metadata = testArtefactMetadata()[0];
metadata.listType = 'SEND_DAILY_HEARING_LIST';

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(jsonData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(metadata);

describe('Accessibility - First-tier Tribunal (Special Educational Needs and Disability) Daily Hearing List', () => {
    testAccessibility(url);
});
