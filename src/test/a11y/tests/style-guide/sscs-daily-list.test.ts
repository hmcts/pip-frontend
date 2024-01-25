import sinon from 'sinon';
import { PublicationService } from '../../../../main/service/publicationService';
import { testArtefactJsonData, testArtefactMetadata } from '../../common/testData';
import { testAccessibility } from '../../common/pa11yHelper';

const sscsDailyListUrl = '/sscs-daily-list';
const sscsDailyListAdditionalHearingsUrl = '/sscs-daily-list-additional-hearings';

const artefactIdMap = new Map<string, string>([
    [sscsDailyListUrl, 'abc'],
    [sscsDailyListAdditionalHearingsUrl, 'def'],
]);

const jsonData = testArtefactJsonData('sscsDailyList.json');
const metaDataSscs = testArtefactMetadata()[0];
metaDataSscs.listType = 'SSCS_DAILY_LIST';
const metaDataSscsAdditionalHearings = testArtefactMetadata()[0];
metaDataSscsAdditionalHearings.listType = 'SSCS_DAILY_LIST_ADDITIONAL_HEARINGS';

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(jsonData);
const metadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
metadataStub.withArgs(artefactIdMap.get(sscsDailyListUrl)).resolves(metaDataSscs);
metadataStub.withArgs(artefactIdMap.get(sscsDailyListAdditionalHearingsUrl)).resolves(metaDataSscsAdditionalHearings);

describe('Accessibility - SSCS Daily List Page', () => {
    testAccessibility(`${sscsDailyListUrl}?artefactId=abc`);
});

describe('Accessibility - SSCS Daily List - Additional Hearings Page', () => {
    testAccessibility(`${sscsDailyListAdditionalHearingsUrl}?artefactId=def`);
});
