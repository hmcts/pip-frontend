import sinon from 'sinon';
import { PublicationService } from '../../../../main/service/PublicationService';
import { testArtefactJsonData, testArtefactMetadata } from '../../common/testData';
import { testAccessibility } from '../../common/pa11yHelper';

const url = '/crown-warned-pdda-list?artefactId=abc';

const jsonData = testArtefactJsonData('crownWarnedPddaList.json');
const metadata = testArtefactMetadata()[0];

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(jsonData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(metadata);

describe('Accessibility - Crown Warned PDDA List Page', () => {
    testAccessibility(url);
});
