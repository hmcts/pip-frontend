import sinon from 'sinon';
import { PublicationService } from '../../../../main/service/PublicationService';
import { testArtefactJsonData, testArtefactMetadata } from '../../common/testData';
import { testAccessibility } from '../../common/pa11yHelper';

const jsonData = testArtefactJsonData('fftTaxWeeklyHearingList.json');

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(jsonData);

const metadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');

describe('Accessibility - Tax Chamber Weekly Hearing List', () => {
    const metadata = testArtefactMetadata()[0];
    metadata.listType = 'FFT_TAX_WEEKLY_HEARING_LIST';

    const url = '/fft-tax-weekly-hearing-list?artefactId=abc';
    metadataStub.withArgs('abc').resolves(metadata);

    testAccessibility(url);
});