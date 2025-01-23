import sinon from 'sinon';
import { PublicationService } from '../../../../main/service/PublicationService';
import { testArtefactJsonData, testArtefactMetadata } from '../../common/testData';
import { testAccessibility } from '../../common/pa11yHelper';

const jsonData = testArtefactJsonData('fttResidentialPropertyTribunalWeeklyHearingList.json');

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(jsonData);

const metadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');

describe('Accessibility - Residential Property Eastern Region Weekly Hearing List', () => {
    const metadata = testArtefactMetadata()[0];
    metadata.listType = 'RPT_EASTERN_WEEKLY_HEARING_LIST';

    const url = '/rpt-eastern-weekly-hearing-list?artefactId=abc';
    metadataStub.withArgs('abc').resolves(metadata);

    testAccessibility(url);
});

describe('Accessibility - Residential Property London Region Weekly Hearing List', () => {
    const metadata = testArtefactMetadata()[0];
    metadata.listType = 'RPT_LONDON_WEEKLY_HEARING_LIST';

    const url = '/rpt-london-weekly-hearing-list?artefactId=abce';
    metadataStub.withArgs('abce').resolves(metadata);

    testAccessibility(url);
});

describe('Accessibility - Residential Property Midlands Region Weekly Hearing List', () => {
    const metadata = testArtefactMetadata()[0];
    metadata.listType = 'RPT_MIDLANDS_WEEKLY_HEARING_LIST';

    const url = '/rpt-midlands-weekly-hearing-list?artefactId=xyz';
    metadataStub.withArgs('xyz').resolves(metadata);

    testAccessibility(url);
});

describe('Accessibility - Residential Property Northern Region Weekly Hearing List', () => {
    const metadata = testArtefactMetadata()[0];
    metadata.listType = 'RPT_NORTHERN_WEEKLY_HEARING_LIST';

    const url = '/rpt-northern-weekly-hearing-list?artefactId=efg';
    metadataStub.withArgs('efg').resolves(metadata);

    testAccessibility(url);
});

describe('Accessibility - Residential Property Southern Region Weekly Hearing List', () => {
    const metadata = testArtefactMetadata()[0];
    metadata.listType = 'RPT_SOUTHERN_WEEKLY_HEARING_LIST';

    const url = '/rpt-southern-weekly-hearing-list?artefactId=abcv';
    metadataStub.withArgs('abcv').resolves(metadata);

    testAccessibility(url);
});
