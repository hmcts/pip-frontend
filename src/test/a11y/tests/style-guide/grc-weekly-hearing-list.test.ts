import sinon from 'sinon';
import { PublicationService } from '../../../../main/service/PublicationService';
import { testArtefactJsonData, testArtefactMetadata } from '../../common/testData';
import { testAccessibility } from '../../common/pa11yHelper';

const url = '/grc-weekly-hearing-list?artefactId=abc';

const jsonData = testArtefactJsonData('grcWeeklyHearingList.json');
const metadata = testArtefactMetadata()[0];
metadata.listType = 'GRC_WEEKLY_HEARING_LIST';

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(jsonData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(metadata);

describe('Accessibility - GRC Weekly Hearing List', () => {
    testAccessibility(url);
});
