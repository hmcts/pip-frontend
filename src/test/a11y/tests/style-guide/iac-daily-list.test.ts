import sinon from 'sinon';
import { PublicationService } from '../../../../main/service/PublicationService';
import { testArtefactJsonData, testArtefactMetadata } from '../../common/testData';
import { testAccessibility } from '../../common/pa11yHelper';

const url = '/iac-daily-list?artefactId=1234';
const additionalCasesUrl = '/iac-daily-list-additional-cases?artefactId=12345';

const jsonData = testArtefactJsonData('iacDailyList.json');
const metadata = testArtefactMetadata()[0];
metadata.listType = 'IAC_DAILY_LIST';

const additionalCasesMetadata = testArtefactMetadata()[0];
additionalCasesMetadata.listType = 'IAC_DAILY_LIST_ADDITIONAL_CASES';

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(jsonData);
const metadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');

metadataStub.withArgs('1234').resolves(metadata);
metadataStub.withArgs('12345').resolves(additionalCasesMetadata);

describe('Accessibility - IAC Daily List Page', () => {
    testAccessibility(url);
});

describe('Accessibility - IAC Daily List Additional Hearings Page', () => {
    testAccessibility(additionalCasesUrl);
});
