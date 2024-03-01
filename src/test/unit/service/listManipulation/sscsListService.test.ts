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
            data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][0]['case'][0][
                'applicant'
            ];
        expect(appellant).to.equal('Applicant Surname');
    });

    it('should return appellant representative', async () => {
        const data = await sscsDailyListService.manipulateSscsDailyListData(rawData);
        const appellantRep =
            data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][0]['case'][0][
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

    it('should return respondent using party respondent', async () => {
        const data = await sscsDailyListService.manipulateSscsDailyListData(rawData);
        const respondent =
            data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][1]['case'][0][
                'formattedRespondent'
            ];
        expect(respondent).to.equal('Respondent Organisation, Respondent Organisation 2');
    });

    it('should return appellants where there are multiple cases in a hearing', async () => {
        const data = await sscsDailyListService.manipulateSscsDailyListData(rawData);
        const appellant1 =
            data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][2]['case'][0][
                'applicant'
                ];
        const appellant2 =
            data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][2]['case'][1][
                'applicant'
                ];
        expect(appellant1).to.equal('Applicant Surname');
        expect(appellant2).to.equal('Applicant Surname 2');

    });

    it('should return judiciary panel', async () => {
        const data = await sscsDailyListService.manipulateSscsDailyListData(rawData);
        const formattedJudiciary =
            data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['formattedJudiciary'];
        expect(formattedJudiciary).to.equal('Judge KnownAs, Judge KnownAs 2');
    });
});
