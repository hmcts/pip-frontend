import sinon from 'sinon';
import { PublicationService } from '../../../../main/service/PublicationService';
import { LocationService } from '../../../../main/service/LocationService';
import { testAccessibility } from '../../common/pa11yHelper';
import { testArtefactJsonData, testArtefactMetadata, testLocationData } from '../../common/testData';

const urlDaily = '/crown-daily-list?artefactId=abc';
const urlFirm = '/crown-firm-list?artefactId=xyz';

const jsonDailyData = testArtefactJsonData('crownDailyPddaList.json');
const jsonFirmData = testArtefactJsonData('crownFirmPddaList.json');

const metadata = testArtefactMetadata()[0];
const locationData = testLocationData();

const metadataDaily = { ...metadata, listType: 'CROWN_DAILY_PDDA_LIST' };
const metadataFirm = { ...metadata, listType: 'CROWN_FIRM_PDDA_LIST' };

sinon.stub(LocationService.prototype, 'getLocationById').resolves(locationData);

const publicationJsonStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson');
publicationJsonStub.withArgs('abc').resolves(jsonDailyData);
publicationJsonStub.withArgs('def').resolves(jsonFirmData);

const publicationMetadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
publicationMetadataStub.withArgs('abc').returns(metadataDaily);
publicationMetadataStub.withArgs('def').returns(metadataFirm);

describe('Accessibility - Crown Daily PDDA List Page', () => {
    testAccessibility(`${urlDaily}?artefactId=abc`);
});

describe('Accessibility - Crown Firm PDDA List Page', () => {
    testAccessibility(`${urlFirm}?artefactId=def`);
});
