import sinon from 'sinon';
import { PublicationService } from '../../../../main/service/PublicationService';
import { LocationService } from '../../../../main/service/LocationService';
import { testAccessibility } from '../../common/pa11yHelper';
import { testArtefactJsonData, testArtefactMetadata, testLocationData } from '../../common/testData';

const url = '/crown-firm-pdda-list?artefactId=xyz';

const jsonData = testArtefactJsonData('crownFirmPddaList.json');
const metadata = testArtefactMetadata()[0];
metadata.listType = 'CROWN_FIRM_PDDA_LIST';
const locationData = testLocationData();

sinon.stub(LocationService.prototype, 'getLocationById').resolves(locationData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(jsonData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').returns(metadata);

describe('Accessibility - Crown Firm PDDA List Page', () => {
    testAccessibility(url);
});
