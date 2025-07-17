import sinon from 'sinon';
import { PublicationService } from '../../../../main/service/PublicationService';
import { testArtefactJsonData, testArtefactMetadata } from '../../common/testData';
import { testAccessibility } from '../../common/pa11yHelper';

const url = '/county-court-london-civil-daily-cause-list?artefactId=abc';

const jsonData = testArtefactJsonData('countyCourtLondonCivilDailyCauseList.json');
const metadata = testArtefactMetadata()[0];
metadata.listType = 'COUNTY_COURT_LONDON_CIVIL_DAILY_CAUSE_LIST';

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(jsonData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(metadata);

describe('Accessibility - County Court at Central London Civil Daily Cause List', () => {
    testAccessibility(url);
});
