import {expect} from "chai";
import {CopDailyListService} from "../../../../main/service/listManipulation/CopDailyListService";
import fs from "fs";
import path from "path";

const service = new CopDailyListService();

const rawData = fs.readFileSync(
    path.resolve(__dirname, '../../mocks/copDailyCauseList.json'),
    'utf-8'
);

describe('COP Daily Cause List service.', function () {
    describe('manipulateCopDailyCauseList', () => {
        it('should format reporting restrictions if reportingRestrictionDetail present', async () => {
            const data = await service.manipulateCopDailyCauseList(rawData);
            const hearingCase =
                data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][0][
                    'case'
                    ][0];
            expect(hearingCase['formattedReportingRestriction']).to.equal('Reporting restriction 1, Reporting restriction 2');
        });

        it('should not format reporting restrictions if reportingRestrictionDetail missing', async () => {
            const data = await service.manipulateCopDailyCauseList(rawData);
            const hearingCase =
                data['courtLists'][1]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][0][
                    'case'
                    ][0];
            expect(hearingCase['formattedReportingRestriction']).to.be.undefined;
        });
    });
});
