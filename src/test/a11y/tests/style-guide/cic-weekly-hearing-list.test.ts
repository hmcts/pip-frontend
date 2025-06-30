import sinon from 'sinon';
import { PublicationService } from '../../../../main/service/PublicationService';
import { testArtefactJsonData, testArtefactMetadata } from '../../common/testData';
import { testAccessibility } from '../../common/pa11yHelper';

const url = '/cic-weekly-hearing-list?artefactId=abc';

const jsonData = testArtefactJsonData('cicWeeklyHearingList.json');
const metadata = testArtefactMetadata()[0];
metadata.listType = 'CIC_WEEKLY_HEARING_LIST';

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(jsonData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(metadata);

describe('Accessibility - CIC Weekly Hearing List', () => {
    testAccessibility(url);
});
