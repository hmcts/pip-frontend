import sinon from 'sinon';
import { PublicationService } from '../../../../main/service/PublicationService';
import { testArtefactJsonData, testArtefactMetadata } from '../../common/testData';
import { testAccessibility } from '../../common/pa11yHelper';

const jsonData = testArtefactJsonData('cstAndPhtWeeklyHearingList.json');

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(jsonData);

const metadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');

describe('Accessibility - CST Weekly Hearing List', () => {
    const metadata = testArtefactMetadata()[0];
    metadata.listType = 'CST_WEEKLY_HEARING_LIST';

    const url = '/cst-weekly-hearing-list?artefactId=abc';
    metadataStub.withArgs('abc').resolves(metadata);

    testAccessibility(url);
});

describe('Accessibility - PHT Weekly Hearing List', () => {
    const metadata = testArtefactMetadata()[0];
    metadata.listType = 'PHT_WEEKLY_HEARING_LIST';

    const url = '/pht-weekly-hearing-list?artefactId=abcd';
    metadataStub.withArgs('abcd').resolves(metadata);

    testAccessibility(url);
});
