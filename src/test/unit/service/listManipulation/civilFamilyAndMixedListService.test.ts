import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import { CivilFamilyAndMixedListService } from '../../../../main/service/listManipulation/CivilFamilyAndMixedListService';

const service = new CivilFamilyAndMixedListService();

const rawFamilyDailyCauseData = fs.readFileSync(
    path.resolve(__dirname, '../../mocks/familyDailyCauseList.json'),
    'utf-8'
);
const rawFamilyDailyCausePartyMappingData = fs.readFileSync(
    path.resolve(__dirname, '../../mocks/familyDailyCauseListPartyMapping.json'),
    'utf-8'
);
const rawFamilyDailyCauseWithReorderedPartyMappings = fs.readFileSync(
    path.resolve(__dirname, '../../mocks/familyDailyCauseListWithReorderedPartyMappings.json'),
    'utf-8'
);
const rawDailyCauseData = fs.readFileSync(path.resolve(__dirname, '../../mocks/dailyCauseList.json'), 'utf-8');
const nonPresidingJudiciary = 'Judge KnownAs, Judge KnownAs Presiding';
describe('Tests for the civil, family and mixed lists service.', function () {
    describe('manipulatedDailyListData', () => {
        let familyDailyCause;
        beforeEach(() => {
            familyDailyCause = JSON.parse(rawFamilyDailyCauseData);
        });

        it('should return daily cause list object', async () => {
            const data = await service.sculptedCivilListData(rawDailyCauseData);
            expect(data['courtLists'].length).to.equal(4);
        });

        it('should calculate duration of Hearing in cause list object', async () => {
            const data = await service.sculptedCivilListData(rawDailyCauseData);
            const sitting = data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0];
            expect(sitting['durationAsHours']).to.equal(1);
            expect(sitting['durationAsMinutes']).to.equal(5);
        });

        it('should calculate duration more than one hour of Hearing in cause list object', async () => {
            const data = await service.sculptedCivilListData(rawDailyCauseData);
            const sitting = data['courtLists'][1]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0];
            expect(sitting['durationAsHours']).to.equal(1);
            expect(sitting['durationAsMinutes']).to.equal(30);
        });

        it('should calculate duration is one hour of Hearing in cause list object', async () => {
            const data = await service.sculptedCivilListData(rawDailyCauseData);
            const sitting = data['courtLists'][2]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0];
            expect(sitting['durationAsHours']).to.equal(1);
            expect(sitting['durationAsMinutes']).to.equal(0);
        });

        it('should calculate duration less than a hour of Hearing in cause list object', async () => {
            const data = await service.sculptedCivilListData(rawDailyCauseData);
            const sitting = data['courtLists'][3]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0];
            expect(sitting['durationAsHours']).to.equal(0);
            expect(sitting['durationAsMinutes']).to.equal(30);
        });

        it('should calculate start time of Hearing in cause list object', async () => {
            const data = await service.sculptedCivilListData(rawDailyCauseData);
            expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['time']).to.equal(
                '10:40am'
            );
        });

        it('should set caseHearingChannel to sitting channel', async () => {
            const data = await service.sculptedFamilyMixedListData(rawFamilyDailyCauseData);
            expect(
                data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['caseHearingChannel']
            ).to.equal('testSittingChannel');
        });

        it('should set sessionChannel to sitting channel', async () => {
            familyDailyCause['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['channel'] =
                [];
            const data = await service.sculptedFamilyMixedListData(JSON.stringify(familyDailyCause));
            expect(
                data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['caseHearingChannel']
            ).to.equal('VIDEO HEARING');
        });

        it('should return empty channel if both hearing and sessionChannel are missing', async () => {
            familyDailyCause['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['channel'] =
                [];
            familyDailyCause['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sessionChannel'] = [];
            const data = await service.sculptedFamilyMixedListData(JSON.stringify(familyDailyCause));
            expect(
                data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['caseHearingChannel']
            ).to.equal('');
        });

        it('should set judiciary to presiding judiciary before other judiciaries', async () => {
            const data = await service.sculptedFamilyMixedListData(rawFamilyDailyCauseData);
            expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['formattedJudiciaries']).to.equal(
                'Judge KnownAs Presiding, Judge KnownAs'
            );
        });

        it('should concat judiciaries with no presiding', async () => {
            familyDailyCause['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['judiciary'][1][
                'isPresiding'
            ] = false;
            const data = await service.sculptedFamilyMixedListData(JSON.stringify(familyDailyCause));
            expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['formattedJudiciaries']).to.equal(
                nonPresidingJudiciary
            );
        });

        it('should build when we have multiple applicants and the respondents of the party', async () => {
            const data = await service.sculptedFamilyMixedListData(rawFamilyDailyCauseData);
            const hearingCase =
                data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][1]['hearing'][0][
                    'case'
                ][0];
            expect(hearingCase['applicant']).to.equal('Applicant Surname 3, Applicant Surname 3a');
            expect(hearingCase['respondent']).to.equal('Respondent Surname 3, Respondent Surname 3a');
        });

        it('should build the applicants and the respondents of the party with data that requires mapping', async () => {
            const data = await service.sculptedFamilyMixedListData(rawFamilyDailyCausePartyMappingData);
            const hearingCase =
                data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][0][
                    'case'
                ][0];
            expect(hearingCase['applicant']).to.equal('Surname');
            expect(hearingCase['respondent']).to.equal('Surname');
        });

        it('should not build the applicants and the respondents of the party if not in data', async () => {
            const data = await service.sculptedFamilyMixedListData(rawFamilyDailyCausePartyMappingData);
            const hearingCase =
                data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][1][
                    'case'
                ][0];
            expect(hearingCase['applicant']).to.be.empty;
            expect(hearingCase['respondent']).to.be.empty;
        });

        it('should build only the applicants and the respondents of the party', async () => {
            const data = await service.sculptedFamilyMixedListData(rawFamilyDailyCausePartyMappingData);
            const hearingCase =
                data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][2][
                    'case'
                ][0];
            expect(hearingCase['applicant']).to.equal('Individual Surname');
            expect(hearingCase['respondent']).to.equal('Individual Surname');
        });

        it('when there is no party information provided', async () => {
            const data = await service.sculptedFamilyMixedListData(rawFamilyDailyCausePartyMappingData);
            const hearingCase =
                data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][3][
                    'case'
                ][0];
            expect(hearingCase['applicant']).to.be.empty;
            expect(hearingCase['respondent']).to.be.empty;
        });

        it('when there is reordered party mappings in the array, it still provides the correct mappings', async () => {
            const data = await service.sculptedFamilyMixedListData(rawFamilyDailyCauseWithReorderedPartyMappings);
            const hearingCase =
                data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][0][
                    'case'
                ][0];
            expect(hearingCase['applicant']).to.equal('Surname');
            expect(hearingCase['respondent']).to.equal('Surname');
        });

        it('should return organisation details using family and mixed list method', async () => {
            const data = await service.sculptedFamilyMixedListData(rawFamilyDailyCauseData);
            const hearingCase =
                data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][1][
                    'case'
                ][0];
            expect(hearingCase['applicant']).to.equal('Applicant org name');
            expect(hearingCase['respondent']).to.equal('Respondent org name');
        });

        it('should not return organisation details using civil list method', async () => {
            const data = await service.sculptedCivilListData(rawFamilyDailyCauseData);
            const hearingCase =
                data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][1][
                    'case'
                ][0];
            expect(hearingCase['applicant']).is.undefined;
            expect(hearingCase['respondent']).is.undefined;
        });
    });
});
