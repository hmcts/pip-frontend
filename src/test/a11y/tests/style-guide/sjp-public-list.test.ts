import sinon from 'sinon';
import { PublicationService } from '../../../../main/service/PublicationService';
import { ListDownloadService } from '../../../../main/service/ListDownloadService';
import { testArtefactJsonData, testArtefactMetadata } from '../../common/testData';
import { testAccessibility } from '../../common/pa11yHelper';

const sjpPublicFullListUrl = '/sjp-public-list';
const sjpPublicNewCasesUrl = '/sjp-public-list-new-cases';

const artefactIdMap = new Map<string, string>([
    [sjpPublicFullListUrl, 'abc'],
    [sjpPublicNewCasesUrl, 'def'],
]);

const jsonData = testArtefactJsonData('sjp-public-list.json');
const metaDataSjpFullList = testArtefactMetadata()[0];
metaDataSjpFullList.listType = 'SJP_PUBLIC_LIST';
const metaDataSjpNewCases = testArtefactMetadata()[0];
metaDataSjpNewCases.listType = 'SJP_DELTA_PUBLIC_LIST';

const metadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
metadataStub.withArgs(artefactIdMap.get(sjpPublicFullListUrl)).resolves(metaDataSjpFullList);
metadataStub.withArgs(artefactIdMap.get(sjpPublicNewCasesUrl)).resolves(metaDataSjpNewCases);

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(jsonData);
sinon.stub(ListDownloadService.prototype, 'showDownloadButton').resolves(true);

describe('Accessibility - SJP Public List (Full List) Page', () => {
    testAccessibility(`${sjpPublicFullListUrl}?artefactId=abc`);
});

describe('Accessibility - SJP Public List (New Cases) Page', () => {
    testAccessibility(`${sjpPublicNewCasesUrl}?artefactId=def`);
});
