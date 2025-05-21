import sinon from 'sinon';
import { PublicationService } from '../../../../main/service/PublicationService';
import { testArtefactJsonData, testArtefactMetadata } from '../../common/testData';
import { testAccessibility } from '../../common/pa11yHelper';

const url = '/senior-courts-costs-office-daily-cause-list?artefactId=abc';

const jsonData = testArtefactJsonData('seniorCourtsCostsOfficeDailyCauseList.json');
const metadata = testArtefactMetadata()[0];
metadata.listType = 'SENIOR_COURTS_COSTS_OFFICE_DAILY_CAUSE_LIST';

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(jsonData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(metadata);

describe('Accessibility - Senior Courts Costs Office Daily Cause List', () => {
    testAccessibility(url);
});
