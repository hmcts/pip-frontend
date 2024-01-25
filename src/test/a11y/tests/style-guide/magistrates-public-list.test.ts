import sinon from 'sinon';
import { PublicationService } from '../../../../main/service/publicationService';
import { LocationRequests } from '../../../../main/resources/requests/locationRequests';
import {testArtefactJsonData, testArtefactMetadata, testLocationData} from "../../common/testData";
import {testAccessibility} from "../../common/pa11yHelper";

const url = '/magistrates-public-list?artefactId=abc';

const jsonData = testArtefactJsonData('magistratesPublicList.json');
const metadata = testArtefactMetadata()[0];
const locationData = testLocationData();

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(jsonData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(metadata);
sinon.stub(LocationRequests.prototype, 'getLocation').resolves(locationData);

describe('Accessibility - Magistrates Public List Page', () => {
    testAccessibility(url);
});
