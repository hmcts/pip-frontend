import sinon from 'sinon';
import { PublicationService } from '../../../../main/service/PublicationService';
import { testArtefactJsonData, testArtefactMetadata } from '../../common/testData';
import { testAccessibility } from '../../common/pa11yHelper';

const url = '/ast-daily-list?artefactId=abc';

const jsonData = testArtefactJsonData('astDailyList.json');
const metadata = testArtefactMetadata()[0];
metadata.listType = 'AST_DAILY_LIST';

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(jsonData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(metadata);

describe('Accessibility - AST Daily List', () => {
    testAccessibility(url);
});
