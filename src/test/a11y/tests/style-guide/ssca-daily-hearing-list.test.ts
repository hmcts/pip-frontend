import sinon from 'sinon';
import { PublicationService } from '../../../../main/service/PublicationService';
import { testArtefactJsonData, testArtefactMetadata } from '../../common/testData';
import { testAccessibility } from '../../common/pa11yHelper';

const jsonData = testArtefactJsonData('sscsDailyHearingList.json');

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(jsonData);

const metadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');

describe('Accessibility - Midlands First-tier Tribunal (Social Security and Child Support) Daily Hearing List', () => {
    const metadata = testArtefactMetadata()[0];
    metadata.listType = 'SSCS_MIDLANDS_DAILY_HEARING_LIST';

    const url = '/sscs-midlands-daily-hearing-list?artefactId=abc';
    metadataStub.withArgs('abc').resolves(metadata);

    testAccessibility(url);
});

describe('Accessibility - South East First-tier Tribunal (Social Security and Child Support) Daily Hearing List', () => {
    const metadata = testArtefactMetadata()[0];
    metadata.listType = 'SSCS_SOUTHEAST_DAILY_HEARING_LIST';

    const url = '/sscs-southeast-daily-hearing-list?artefactId=abce';
    metadataStub.withArgs('abce').resolves(metadata);

    testAccessibility(url);
});

describe('Accessibility - Wales and South West First-tier Tribunal (Social Security and Child Support) Daily Hearing List', () => {
    const metadata = testArtefactMetadata()[0];
    metadata.listType = 'SSCS_WALES_AND_SOUTHEAST_DAILY_HEARING_LIST';

    const url = '/sscs-wales-and-southeast-daily-hearing-list?artefactId=xyz';
    metadataStub.withArgs('xyz').resolves(metadata);

    testAccessibility(url);
});

describe('Accessibility - Scotland First-tier Tribunal (Social Security and Child Support) Daily Hearing List', () => {
    const metadata = testArtefactMetadata()[0];
    metadata.listType = 'SSCS_SCOTLAND_DAILY_HEARING_LIST';

    const url = '/sscs-scotland-daily-hearing-list?artefactId=efg';
    metadataStub.withArgs('efg').resolves(metadata);

    testAccessibility(url);
});

describe('Accessibility - North East First-tier Tribunal (Social Security and Child Support) Daily Hearing List', () => {
    const metadata = testArtefactMetadata()[0];
    metadata.listType = 'SSCS_NORTHEAST_DAILY_HEARING_LIST';

    const url = '/sscs-northeast-daily-hearing-list?artefactId=abcv';
    metadataStub.withArgs('abcv').resolves(metadata);

    testAccessibility(url);
});

describe('Accessibility - North West First-tier Tribunal (Social Security and Child Support) Daily Hearing List', () => {
    const metadata = testArtefactMetadata()[0];
    metadata.listType = 'SSCS_NORTHWEST_DAILY_HEARING_LIST';

    const url = '/sscs-northwest-daily-hearing-list?artefactId=west';
    metadataStub.withArgs('west').resolves(metadata);

    testAccessibility(url);
});

describe('Accessibility - London First-tier Tribunal (Social Security and Child Support) Daily Hearing List', () => {
    const metadata = testArtefactMetadata()[0];
    metadata.listType = 'SSCS_LONDON_DAILY_HEARING_LIST';

    const url = '/sscs-london-daily-hearing-list?artefactId=lond';
    metadataStub.withArgs('lond').resolves(metadata);

    testAccessibility(url);
});
