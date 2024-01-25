import sinon from 'sinon';
import { PublicationService } from '../../../../main/service/publicationService';
import { LocationRequests } from '../../../../main/resources/requests/locationRequests';
import {testArtefactJsonData, testArtefactMetadata, testLocationData} from "../../common/testData";
import {testAccessibility} from "../../common/pa11yHelper";

const url = '/daily-cause-list?artefactId=abc';

const jsonData = testArtefactJsonData('dailyCauseList.json');
const metadata = testArtefactMetadata()[0];
const locationData = testLocationData();
metadata.listType = 'CIVIL_DAILY_CAUSE_LIST';

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(jsonData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(metadata);
sinon.stub(LocationRequests.prototype, 'getLocation').resolves(locationData);

describe('Accessibility - Civil Daily Cause List Page', () => {
    testAccessibility(url);
});
