import sinon from 'sinon';
import { PublicationService } from '../../../../main/service/PublicationService';
import { testArtefactJsonData, testArtefactMetadata } from '../../common/testData';
import { testAccessibility } from '../../common/pa11yHelper';

const url = '/wpafcc-weekly-hearing-list?artefactId=abc';

const jsonData = testArtefactJsonData('wpafccWeeklyHearingList.json');
const metadata = testArtefactMetadata()[0];
metadata.listType = 'WPAFCC_WEEKLY_HEARING_LIST';

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(jsonData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(metadata);

describe('Accessibility - WPAFCC Weekly Hearing List', () => {
    testAccessibility(url);
});
