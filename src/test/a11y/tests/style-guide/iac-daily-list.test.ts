import sinon from 'sinon';
import { PublicationService } from '../../../../main/service/publicationService';
import {testArtefactJsonData, testArtefactMetadata} from "../../common/testData";
import {testAccessibility} from "../../common/pa11yHelper";

const url = '/iac-daily-list?artefactId=abc';

const jsonData = testArtefactJsonData('iacDailyList.json');
const metadata = testArtefactMetadata()[0];

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(jsonData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(metadata);

describe('Accessibility - IAC Daily List Page', () => {
    testAccessibility(url);
});
