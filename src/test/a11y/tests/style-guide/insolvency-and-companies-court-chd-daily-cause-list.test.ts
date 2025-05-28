import sinon from 'sinon';
import { PublicationService } from '../../../../main/service/PublicationService';
import { LocationRequests } from '../../../../main/resources/requests/LocationRequests';
import { testArtefactJsonData, testArtefactMetadata, testLocationData } from '../../common/testData';
import { testAccessibility } from '../../common/pa11yHelper';

const url = '/insolvency-and-companies-court-chd-daily-cause-list?artefactId=abc';

const jsonData = testArtefactJsonData('insolvencyAndCompaniesCourtChdDailyCauseList.json');
const metadata = testArtefactMetadata()[0];
const locationData = testLocationData();
metadata.listType = 'INSOLVENCY_AND_COMPANIES_COURT_CHD_DAILY_CAUSE_LIST';

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(jsonData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(metadata);
sinon.stub(LocationRequests.prototype, 'getLocation').resolves(locationData);

describe('Accessibility - Insolvency & Companies Court (Chancery Division) Daily Cause List', () => {
    testAccessibility(url);
});
