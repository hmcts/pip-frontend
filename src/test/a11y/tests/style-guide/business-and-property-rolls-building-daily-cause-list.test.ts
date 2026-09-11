import sinon from 'sinon';
import { PublicationService } from '../../../../main/service/PublicationService';
import { testArtefactJsonData, testArtefactMetadata } from '../../common/testData';
import { testAccessibility } from '../../common/pa11yHelper';

const url = '/business-and-property-division-rolls-building-daily-cause-list?artefactId=abc';

const jsonData = testArtefactJsonData('businessAndPropertyDivisionRollsBuildingDailyCauseList.json');
const metadata = testArtefactMetadata()[0];
metadata.listType = 'BUSINESS_AND_PROPERTY_DIVISION_ROLLS_BUILDING_DAILY_CAUSE_LIST';

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(jsonData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(metadata);

describe('Accessibility - Business and Property Rolls Building Daily Cause List', () => {
    testAccessibility(url);
});
