import sinon from 'sinon';
import { PublicationService } from '../../../../main/service/PublicationService';
import { testArtefactJsonData, testArtefactMetadata } from '../../common/testData';
import { testAccessibility } from '../../common/pa11yHelper';

const jsonData = testArtefactJsonData('utTaxAndChanceryChamberWeeklyHearingList.json');

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(jsonData);

const metadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');

describe('Accessibility - Upper Tribunal (Tax and Chancery Chamber)', () => {
    const metadata = testArtefactMetadata()[0];
    metadata.listType = 'UT_T_AND_CC_WEEKLY_HEARING_LIST';

    const url = '/ut-t-and-cc-weekly-hearing-list?artefactId=abc';
    metadataStub.withArgs('abc').resolves(metadata);

    testAccessibility(url);
});
