import fs from 'fs';
import path from 'path';
import { SscsDailyListService } from '../../../../main/service/listManipulation/SscsDailyListService';
import { expect } from 'chai';

const sscsDailyListService = new SscsDailyListService();
const rawData = fs.readFileSync(path.resolve(__dirname, '../../mocks/sscsDailyList.json'), 'utf-8');

describe('manipulateSscsDailyListData', () => {
    it('should return hearing time', async () => {
        const data = await sscsDailyListService.manipulateSscsDailyListData(rawData);
        const hearingTime =
            data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['sittingStartFormatted'];
        expect(hearingTime).to.equal('12:30am');
    });

    it('should return hearing channel', async () => {
        const data = await sscsDailyListService.manipulateSscsDailyListData(rawData);
        const hearingChannel =
            data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['caseHearingChannel'];
        expect(hearingChannel).to.equal('Teams, Attended');
    });

    it('should return appellant for case level party', async () => {
        const data = await sscsDailyListService.manipulateSscsDailyListData(rawData);
        const appellant =
            data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][0]['case'][0]['applicant'];
        expect(appellant).to.equal('CasePartyNamePetitioner');
    });

    it('should return appellant representative for case level party', async () => {
        const data = await sscsDailyListService.manipulateSscsDailyListData(rawData);
        const appellantRep =
            data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][0]['case'][0][
                'applicantRepresentative'
            ];
        expect(appellantRep).to.equal('Mr Test A CasePartyNamePetitionerRep');
    });

    it('should return appellant for hearing level party', async () => {
        const data = await sscsDailyListService.manipulateSscsDailyListData(rawData);
        const appellant =
            data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][1]['applicant'];
        expect(appellant).to.equal('HearingPartyNamePetitioner');
    });

    it('should return appellant representative for hearing level party', async () => {
        const data = await sscsDailyListService.manipulateSscsDailyListData(rawData);
        const appellantRep =
            data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][1][
                'applicantRepresentative'
                ];
        expect(appellantRep).to.equal('Mr Test A HearingPartyNamePetitionerRep');
    });

    it('should return respondent using informant', async () => {
        const data = await sscsDailyListService.manipulateSscsDailyListData(rawData);
        const respondent =
            data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][0][
                'formattedRespondent'
            ];
        expect(respondent).to.equal('test, test2');
    });

    it('should return respondent using party prosecutor', async () => {
        const data = await sscsDailyListService.manipulateSscsDailyListData(rawData);
        const respondent =
            data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][1][
                'formattedRespondent'
            ];
        expect(respondent).to.equal('Prosecutor1, Prosecutor2');
    });

    it('should return judiciary panel', async () => {
        const data = await sscsDailyListService.manipulateSscsDailyListData(rawData);
        const formattedJudiciary =
            data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['formattedJudiciary'];
        expect(formattedJudiciary).to.equal('Judge Test Name, Magistrate Test Name');
    });
});
