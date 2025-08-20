import sinon from 'sinon';
import { PublicationService } from '../../../../main/service/PublicationService';
import { testAccessibility } from '../../common/pa11yHelper';
import {
    MagistratesAdultCourtListService
} from '../../../../main/service/listManipulation/MagistratesAdultCourtListService';
import { LocationService } from '../../../../main/service/LocationService';
import { testArtefactJsonData, testArtefactMetadata, testLocationData } from '../../common/testData';

const userId = '1'
const urlDailyList = '/magistrates-adult-court-list-daily';
const urlFutureList = '/magistrates-adult-court-list-future';

const jsonData = testArtefactJsonData('magistratesAdultCourtList.json');
const metadata = testArtefactMetadata()[0];
const locationData = testLocationData();

const metadataDailyList = metadata;
metadataDailyList.listType = 'MAGISTRATES_ADULT_COURT_LIST_DAILY';
const metadataFutureList = metadata;
metadataFutureList.listType = 'MAGISTRATES_ADULT_COURT_LIST_FUTURE';

sinon.stub(MagistratesAdultCourtListService.prototype, 'processPayload').resolves(jsonData);
sinon.stub(LocationService.prototype, 'getLocationById').resolves(locationData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(jsonData);

const metadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
metadataStub.withArgs('abc', userId).returns(metadataDailyList);
metadataStub.withArgs('def', userId).returns(metadataFutureList);

describe('Accessibility - Magistrates Adult Court List Daily Page', () => {
    testAccessibility(`${urlDailyList}?artefactId=abc`);
});

describe('Accessibility - Magistrates Adult Court List Future Page', () => {
    testAccessibility(`${urlFutureList}?artefactId=def`);
});
