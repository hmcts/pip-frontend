import sinon from 'sinon';
import { PublicationService } from '../../../../main/service/PublicationService';
import { testArtefactJsonData, testArtefactMetadata } from '../../common/testData';
import { testAccessibility } from '../../common/pa11yHelper';

const url = '/kings-bench-masters-daily-cause-list?artefactId=abc';

const jsonData = testArtefactJsonData('kingsBenchMastersDailyCauseList.json');
const metadata = testArtefactMetadata()[0];
metadata.listType = 'KINGS_BENCH_MASTERS_DAILY_CAUSE_LIST';

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(jsonData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(metadata);

describe('Accessibility - King’s Bench Masters Daily Cause List', () => {
    testAccessibility(url);
});
