import sinon from 'sinon';
import { PublicationService } from '../../../../main/service/PublicationService';
import { testArtefactJsonData, testArtefactMetadata } from '../../common/testData';
import { testAccessibility } from '../../common/pa11yHelper';

const url = '/kings-bench-division-daily-cause-list?artefactId=abc';

const jsonData = testArtefactJsonData('kingsBenchDivisionDailyCauseList.json');
const metadata = testArtefactMetadata()[0];
metadata.listType = 'KINGS_BENCH_DIVISION_DAILY_CAUSE_LIST';

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(jsonData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(metadata);

describe('Accessibility - King’s Bench Division Daily Cause List', () => {
    testAccessibility(url);
});
