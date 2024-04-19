import sinon from 'sinon';
import { PublicationService } from '../../../../main/service/PublicationService';
import { testArtefactJsonData, testArtefactMetadata } from '../../common/testData';
import { testAccessibility } from '../../common/pa11yHelper';

const url = '/crown-warned-list?artefactId=abc';

const jsonData = testArtefactJsonData('crownWarnedList.json');
const metadata = testArtefactMetadata()[0];

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(jsonData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(metadata);

describe('Accessibility - Crown Warned List Page', () => {
    testAccessibility(url);
});
