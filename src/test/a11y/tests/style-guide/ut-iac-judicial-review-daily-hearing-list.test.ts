import sinon from 'sinon';
import { PublicationService } from '../../../../main/service/PublicationService';
import { testArtefactJsonData, testArtefactMetadata } from '../../common/testData';
import { testAccessibility } from '../../common/pa11yHelper';

const jsonData = testArtefactJsonData('utIacJudicialReviewDailyHearingList.json');

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(jsonData);

const metadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');

describe('Accessibility - UTIAC (JR) - London Daily Hearing List', () => {
    const metadata = testArtefactMetadata()[0];
    metadata.listType = 'UT_IAC_JR_LONDON_DAILY_HEARING_LIST';

    const url = '/ut-iac-jr-london-daily-hearing-list?artefactId=abc';
    metadataStub.withArgs('abc').resolves(metadata);

    testAccessibility(url);
});

describe('Accessibility - UTIAC (JR) - Manchester Daily Hearing List', () => {
    const metadata = testArtefactMetadata()[0];
    metadata.listType = 'UT_IAC_JR_MANCHESTER_DAILY_HEARING_LIST';

    const url = '/ut-iac-jr-manchester-daily-hearing-list?artefactId=def';
    metadataStub.withArgs('def').resolves(metadata);

    testAccessibility(url);
});

describe('Accessibility - UTIAC (JR) - Birmingham Daily Hearing List', () => {
    const metadata = testArtefactMetadata()[0];
    metadata.listType = 'UT_IAC_JR_BIRMINGHAM_DAILY_HEARING_LIST';

    const url = '/ut-iac-jr-birmingham-daily-hearing-list?artefactId=mno';
    metadataStub.withArgs('mno').resolves(metadata);

    testAccessibility(url);
});

describe('Accessibility - UTIAC (JR) - Cardiff Daily Hearing List', () => {
    const metadata = testArtefactMetadata()[0];
    metadata.listType = 'UT_IAC_JR_CARDIFF_DAILY_HEARING_LIST';

    const url = '/ut-iac-jr-cardiff-daily-hearing-list?artefactId=xyz';
    metadataStub.withArgs('xyz').resolves(metadata);

    testAccessibility(url);
});

describe('Accessibility - UTIAC (JR) - Leeds Daily Hearing List', () => {
    const metadata = testArtefactMetadata()[0];
    metadata.listType = 'UT_IAC_JR_LEEDS_DAILY_HEARING_LIST';

    const url = '/ut-iac-jr-leeds-daily-hearing-list?artefactId=ghi';
    metadataStub.withArgs('ghi').resolves(metadata);

    testAccessibility(url);
});
