import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import { CivilFamilyAndMixedListService } from '../../../../../main/service/listManipulation/CivilFamilyAndMixedListService';

const service = new CivilFamilyAndMixedListService();

const expectedMultipleApplicant = 'Applicant Surname1, Surname2';
const expectedMultipleRespondent = 'Respondent Surname1, Surname2';
const expectedApplicant = 'Surname';
const expectedRespondent = expectedApplicant;
const rawFamilyDailyCauseData = fs.readFileSync(
    path.resolve(__dirname, '../../../mocks/hearingparty/familyDailyCauseList.json'),
    'utf-8'
);
const rawFamilyDailyCausePartyMappingData = fs.readFileSync(
    path.resolve(__dirname, '../../../mocks/hearingparty/familyDailyCauseListPartyMapping.json'),
    'utf-8'
);
const rawFamilyDailyCauseWithReorderedPartyMappings = fs.readFileSync(
    path.resolve(__dirname, '../../../mocks/hearingparty/familyDailyCauseListWithReorderedPartyMappings.json'),
    'utf-8'
);
const nonPresidingJudiciary = 'Judge KnownAs, Judge KnownAs Presiding';
describe('Tests for the civil, family and mixed lists service.', function () {
    describe('manipulatedDailyListData', () => {
        let familyDailyCause;
        beforeEach(() => {
            familyDailyCause = JSON.parse(rawFamilyDailyCauseData);
        });

        it('should set caseHearingChannel to sitting channel', async () => {
            const data = await service.sculptedListDataPartyAtHearingLevel(rawFamilyDailyCauseData, true);
            expect(
                data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['caseHearingChannel']
            ).to.equal('testSittingChannel');
        });

        it('should set sessionChannel to sitting channel', async () => {
            familyDailyCause['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['channel'] =
                [];
            const data = await service.sculptedListDataPartyAtHearingLevel(JSON.stringify(familyDailyCause), true);
            expect(
                data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['caseHearingChannel']
            ).to.equal('VIDEO HEARING');
        });

        it('should return empty channel if both hearing and sessionChannel are missing', async () => {
            familyDailyCause['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['channel'] =
                [];
            familyDailyCause['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sessionChannel'] = [];
            const data = await service.sculptedListDataPartyAtHearingLevel(JSON.stringify(familyDailyCause));
            expect(
                data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['caseHearingChannel']
            ).to.equal('');
        });

        it('should set judiciary to presiding judiciary before other judiciaries', async () => {
            const data = await service.sculptedListDataPartyAtHearingLevel(rawFamilyDailyCauseData, true);
            expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['formattedJudiciaries']).to.equal(
                'Judge KnownAs Presiding, Judge KnownAs'
            );
        });

        it('should concat judiciaries with no presiding', async () => {
            familyDailyCause['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['judiciary'][1][
                'isPresiding'
            ] = false;
            const data = await service.sculptedListDataPartyAtHearingLevel(JSON.stringify(familyDailyCause), true);
            expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['formattedJudiciaries']).to.equal(
                nonPresidingJudiciary
            );
        });

        it('should not build the applicants and the respondents of the party for hearing with multiple cases', async () => {
            const data = await service.sculptedListDataPartyAtHearingLevel(rawFamilyDailyCauseData, true);
            expect(
                data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][0][
                    'applicant'
                ]
            ).is.undefined;
            expect(
                data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][0][
                    'respondent'
                ]
            ).is.undefined;
        });

        it('should build the applicants and the respondents of the party for haring with a single case', async () => {
            const data = await service.sculptedListDataPartyAtHearingLevel(rawFamilyDailyCauseData, true);
            expect(
                data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][1][
                    'applicant'
                ]
            ).to.equal(expectedApplicant);
            expect(
                data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][1][
                    'respondent'
                ]
            ).to.equal(expectedRespondent);
        });

        it('should build when we have multiple applicants and the respondents of the party', async () => {
            const data = await service.sculptedListDataPartyAtHearingLevel(rawFamilyDailyCauseData, true);
            expect(
                data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][1]['hearing'][0][
                    'applicant'
                ]
            ).to.equal(expectedMultipleApplicant);
            expect(
                data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][1]['hearing'][0][
                    'respondent'
                ]
            ).to.equal(expectedMultipleRespondent);
        });

        it('should build the applicants and the respondents of the party with data that requires mapping', async () => {
            const data = await service.sculptedListDataPartyAtHearingLevel(rawFamilyDailyCausePartyMappingData, true);
            expect(
                data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][0][
                    'applicant'
                ]
            ).to.equal(expectedApplicant);
            expect(
                data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][0][
                    'respondent'
                ]
            ).to.equal(expectedRespondent);
        });

        it('should not build the applicants and the respondents of the party if not in data', async () => {
            const data = await service.sculptedListDataPartyAtHearingLevel(rawFamilyDailyCausePartyMappingData, true);
            expect(
                data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][1][
                    'applicant'
                ]
            ).to.be.empty;
            expect(
                data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][1][
                    'respondent'
                ]
            ).to.be.empty;
        });

        it('should build only the applicants and the respondents of the party', async () => {
            const data = await service.sculptedListDataPartyAtHearingLevel(rawFamilyDailyCausePartyMappingData, true);
            expect(
                data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][2][
                    'applicant'
                ]
            ).to.equal('Individual Surname');
            expect(
                data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][2][
                    'respondent'
                ]
            ).to.equal('Individual Surname');
        });

        it('when there is no party information provided', async () => {
            const data = await service.sculptedListDataPartyAtHearingLevel(rawFamilyDailyCausePartyMappingData, true);
            expect(
                data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][3][
                    'applicant'
                ]
            ).to.be.empty;
            expect(
                data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][3][
                    'respondent'
                ]
            ).to.be.empty;
        });

        it('when there is reordered party mappings in the array, it still provides the correct mappings', async () => {
            const data = await service.sculptedListDataPartyAtHearingLevel(rawFamilyDailyCauseWithReorderedPartyMappings, true);
            expect(
                data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][0][
                    'applicant'
                ]
            ).to.equal(expectedApplicant);
            expect(
                data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][0][
                    'respondent'
                ]
            ).to.equal(expectedRespondent);
        });

        it('should return organisation details using family and mixed list method', async () => {
            const data = await service.sculptedListDataPartyAtHearingLevel(rawFamilyDailyCauseData, true);
            const hearing =
                data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][2];
            expect(hearing['applicant']).to.equal('Applicant org name');
            expect(hearing['respondent']).to.equal('Respondent org name');
        });
    });
});
