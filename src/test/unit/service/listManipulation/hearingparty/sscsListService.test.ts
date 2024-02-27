import fs from 'fs';
import path from 'path';
import { SscsDailyListService } from '../../../../../main/service/listManipulation/SscsDailyListService';
import { expect } from 'chai';

const sscsDailyListService = new SscsDailyListService();
const rawData = fs.readFileSync(path.resolve(__dirname, '../../../mocks/hearingparty/sscsDailyList.json'), 'utf-8');

describe('manipulateSscsDailyListData', () => {
    it('should return hearing time', async () => {
        const data = await sscsDailyListService.manipulateSscsDailyListData(rawData);
        const hearingTime =
            data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['sittingStartFormatted'];
        expect(hearingTime).to.equal('10:40am');
    });

    it('should return hearing channel', async () => {
        const data = await sscsDailyListService.manipulateSscsDailyListData(rawData);
        const hearingChannel =
            data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['caseHearingChannel'];
        expect(hearingChannel).to.equal('Teams, Attended');
    });

    it('should return appellant', async () => {
        const data = await sscsDailyListService.manipulateSscsDailyListData(rawData);
        const appellant =
            data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][0]['applicant'];
        expect(appellant).to.equal('Applicant Surname');
    });

    it('should return appellant representative', async () => {
        const data = await sscsDailyListService.manipulateSscsDailyListData(rawData);
        const appellantRep =
            data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][0][
                'applicantRepresentative'
                ];
        expect(appellantRep).to.equal('Mr Forename Middlename Applicant Representative');
    });

    it('should return respondent using informant', async () => {
        const data = await sscsDailyListService.manipulateSscsDailyListData(rawData);
        const respondent =
            data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][0]['case'][0][
                'formattedRespondent'
                ];
        expect(respondent).to.equal('Informant1, Informant2');
    });

    it('should return respondent using party prosecutor', async () => {
        const data = await sscsDailyListService.manipulateSscsDailyListData(rawData);
        const respondent =
            data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][1]['case'][0][
                'formattedRespondent'
                ];
        expect(respondent).to.equal('Prosecutor1, Prosecutor2');
    });

    it('should return empty string appellant if not present', async () => {
        const data = await sscsDailyListService.manipulateSscsDailyListData(rawData);
        const appellant =
            data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][2]['applicant'];
        expect(appellant).to.equal('');
    });

    it('should return judiciary panel', async () => {
        const data = await sscsDailyListService.manipulateSscsDailyListData(rawData);
        const formattedJudiciary =
            data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['formattedJudiciary'];
        expect(formattedJudiciary).to.equal('Judge KnownAs, Judge KnownAs 2');
    });
});
