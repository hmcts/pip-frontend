import sinon from 'sinon';
import { PublicationService } from '../../../../main/service/PublicationService';
import { testArtefactJsonData, testArtefactMetadata } from '../../common/testData';
import { testAccessibility } from '../../common/pa11yHelper';

const url = '/ut-iac-statutory-appeals-daily-hearing-list?artefactId=abc';

const jsonData = testArtefactJsonData('utIacStatutoryAppealsDailyHearingList.json');
const metadata = testArtefactMetadata()[0];
metadata.listType = 'UT_IAC_STATUTORY_APPEALS_DAILY_HEARING_LIST';

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(jsonData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(metadata);

describe('Accessibility - UT IAC Statutory Appeals Daily Hearing List', () => {
    testAccessibility(url);
});
