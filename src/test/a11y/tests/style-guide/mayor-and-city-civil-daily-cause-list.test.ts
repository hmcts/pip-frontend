import sinon from 'sinon';
import { PublicationService } from '../../../../main/service/PublicationService';
import { testArtefactJsonData, testArtefactMetadata } from '../../common/testData';
import { testAccessibility } from '../../common/pa11yHelper';

const url = '/mayor-and-city-civil-daily-cause-list?artefactId=abc';

const jsonData = testArtefactJsonData('mayorAndCityCivilDailyCauseList.json');
const metadata = testArtefactMetadata()[0];
metadata.listType = 'MAYOR_AND_CITY_CIVIL_DAILY_CAUSE_LIST';

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(jsonData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(metadata);

describe('Accessibility - Mayor & City Civil Daily Cause List', () => {
    testAccessibility(url);
});
