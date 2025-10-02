import sinon from 'sinon';
import { PublicationService } from '../../../../main/service/PublicationService';
import { testAccessibility } from '../../common/pa11yHelper';
import { LocationService } from '../../../../main/service/LocationService';
import { testArtefactJsonData, testArtefactMetadata, testLocationData } from '../../common/testData';

const userId = '1';
const urlDailyList = '/magistrates-adult-court-list-daily';
const urlFutureList = '/magistrates-adult-court-list-future';
const urlPublicDailyList = '/magistrates-public-adult-court-list-daily';
const urlPublicFutureList = '/magistrates-public-adult-court-list-future';

const standardJsonData = testArtefactJsonData('magistratesAdultCourtList.json');
const publicJsonData = testArtefactJsonData('magistratesPublicAdultCourtList.json');
const metadata = testArtefactMetadata()[0];
const locationData = testLocationData();

const metadataDailyList = metadata;
metadataDailyList.listType = 'MAGISTRATES_ADULT_COURT_LIST_DAILY';
const metadataFutureList = metadata;
metadataFutureList.listType = 'MAGISTRATES_ADULT_COURT_LIST_FUTURE';
const metadataPublicDailyList = metadata;
metadataPublicDailyList.listType = 'MAGISTRATES_PUBLIC_ADULT_COURT_LIST_DAILY';
const metadataPublicFutureList = metadata;
metadataPublicFutureList.listType = 'MAGISTRATES_PUBLIC_ADULT_COURT_LIST_FUTURE';

sinon.stub(LocationService.prototype, 'getLocationById').resolves(locationData);

const magsAdultCourtListJsonStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson');
magsAdultCourtListJsonStub.withArgs('abc').resolves(standardJsonData);
magsAdultCourtListJsonStub.withArgs('def').resolves(standardJsonData);
magsAdultCourtListJsonStub.withArgs('ace').resolves(publicJsonData);
magsAdultCourtListJsonStub.withArgs('dfg').resolves(publicJsonData);

const metadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
metadataStub.withArgs('abc', userId).returns(metadataDailyList);
metadataStub.withArgs('def', userId).returns(metadataFutureList);
metadataStub.withArgs('ace', userId).returns(metadataPublicDailyList);
metadataStub.withArgs('dfg', userId).returns(metadataPublicFutureList);

describe('Accessibility - Magistrates Adult Court List Daily Page', () => {
    testAccessibility(`${urlDailyList}?artefactId=abc`);
});

describe('Accessibility - Magistrates Adult Court List Future Page', () => {
    testAccessibility(`${urlFutureList}?artefactId=def`);
});

describe('Accessibility - Magistrates Public Adult Court List Daily Page', () => {
    testAccessibility(`${urlPublicDailyList}?artefactId=ace`);
});

describe('Accessibility - Magistrates Public Adult Court List Future Page', () => {
    testAccessibility(`${urlPublicFutureList}?artefactId=dfg`);
});
