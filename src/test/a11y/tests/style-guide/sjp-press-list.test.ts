import sinon from 'sinon';
import { PublicationService } from '../../../../main/service/publicationService';
import { ListDownloadService } from '../../../../main/service/listDownloadService';
import { testArtefactJsonData, testArtefactMetadata, testLocationData } from '../../common/testData';
import { testAccessibility } from '../../common/pa11yHelper';
import { LocationRequests } from '../../../../main/resources/requests/locationRequests';

const sjpPressFullListUrl = '/sjp-press-list';
const sjpPressNewCasesUrl = '/sjp-press-list-new-cases';

const artefactIdMap = new Map<string, string>([
    [sjpPressFullListUrl, 'abc'],
    [sjpPressNewCasesUrl, 'def'],
]);

const jsonData = testArtefactJsonData('sjp-press-list.json');
const metaDataSjpFullList = testArtefactMetadata()[0];
metaDataSjpFullList.listType = 'SJP_PRESS_LIST';
const metaDataSjpNewCases = testArtefactMetadata()[0];
metaDataSjpNewCases.listType = 'SJP_DELTA_PRESS_LIST';
const locationData = testLocationData();

const metadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
metadataStub.withArgs(artefactIdMap.get(sjpPressFullListUrl)).resolves(metaDataSjpFullList);
metadataStub.withArgs(artefactIdMap.get(sjpPressNewCasesUrl)).resolves(metaDataSjpNewCases);

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(jsonData);
sinon.stub(LocationRequests.prototype, 'getLocation').resolves(locationData);
sinon.stub(ListDownloadService.prototype, 'showDownloadButton').resolves(true);

describe('Accessibility - SJP Press List (Full List) Page', () => {
    testAccessibility(`${sjpPressFullListUrl}?artefactId=abc`);
});

describe('Accessibility - SJP Press List (New Cases) Page', () => {
    testAccessibility(`${sjpPressNewCasesUrl}?artefactId=def`);
});
