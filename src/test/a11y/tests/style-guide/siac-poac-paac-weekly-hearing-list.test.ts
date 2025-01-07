import sinon from 'sinon';
import { PublicationService } from '../../../../main/service/PublicationService';
import { testArtefactJsonData, testArtefactMetadata } from '../../common/testData';
import { testAccessibility } from '../../common/pa11yHelper';

const jsonData = testArtefactJsonData('siacWeeklyHearingList.json');

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(jsonData);

const metadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');

describe('Accessibility - SIAC Weekly Hearing List', () => {
    const metadata = testArtefactMetadata()[0];
    metadata.listType = 'SIAC_WEEKLY_HEARING_LIST';

    const url = '/siac-weekly-hearing-list?artefactId=abc';
    metadataStub.withArgs('abc').resolves(metadata);

    testAccessibility(url);
});

describe('Accessibility - POAC Weekly Hearing List', () => {
    const metadata = testArtefactMetadata()[0];
    metadata.listType = 'POAC_WEEKLY_HEARING_LIST';

    const url = '/poac-weekly-hearing-list?artefactId=abcd';
    metadataStub.withArgs('abcd').resolves(metadata);

    testAccessibility(url);
});

describe('Accessibility - PAAC Weekly Hearing List', () => {
    const metadata = testArtefactMetadata()[0];
    metadata.listType = 'PAAC_WEEKLY_HEARING_LIST';

    const url = '/paac-weekly-hearing-list?artefactId=abce';
    metadataStub.withArgs('abce').resolves(metadata);

    testAccessibility(url);
});
