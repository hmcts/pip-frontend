import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import { CrownFirmListService } from '../../../../main/service/listManipulation/crownFirmListService';

const crownFirmListService = new CrownFirmListService();
const rawCrownFirmData = fs.readFileSync(path.resolve(__dirname, '../../mocks/crownFirmSemiDigested.json'), 'utf-8');
const row = JSON.parse(`{"caseNumber": "I4Y416QE", "caseSeparator": "7 of 9",
"courtName": "Glasgow Social Security and Child Support",
"courtRoom": "to be allocated [Glasgow Social Security and Child Support]",
"defendant": "Sausage, Nigel", "defendantRepresentative": "Daniel Forrester", "durationAsHours": 2,
"durationAsMinutes": 23, "formattedDuration": "2 hours 23 mins", "durationSortValue": 143, "hearingNotes": "",
"hearingPlatform": "Teams, Attended", "hearingType": "Deposition", "joh": "",
"linkedCases": "YRYCTRR3, YRYCTRR4, YRYCTRR5", "prosecutingAuthority": "The Queen",
"sittingDate": "Saturday 15 April 2023", "sittingTime": "2:41pm"}
`);
const lng = 'en';
const languageFile = 'crown-firm-list';

describe('Crown firm list splitter service', () => {
    describe('Crown firm list splitter service', () => {
        it('should split the data down to the day, courtroom and courthouse level', async () => {
            const data = await crownFirmListService.splitOutFirmListData(rawCrownFirmData, lng, languageFile);
            expect(data[1]['days'][1][2]['data'][0]).to.deep.equal(row);
        });

        it('should split the initial json file down to two courtHouses', async () => {
            const data = await crownFirmListService.splitOutFirmListData(
                JSON.stringify(JSON.parse(rawCrownFirmData)),
                lng,
                languageFile
            );
            expect(data.length).to.equal(2);
            expect(data[0].courtName).equal('Colchester Social Security and Child Support');
            expect(data[1].courtName).equal('Glasgow Social Security and Child Support');
        });

        it('should split by date on each courtHouse object', async () => {
            const data = await crownFirmListService.splitOutFirmListData(
                JSON.stringify(JSON.parse(rawCrownFirmData)),
                lng,
                languageFile
            );
            expect(data[0].days.length).to.equal(1);
            expect(data[1].days.length).to.equal(2);
        });

        it('should capture the correct courtRoom name at the day level', async () => {
            const data = await crownFirmListService.splitOutFirmListData(
                JSON.stringify(JSON.parse(rawCrownFirmData)),
                lng,
                languageFile
            );
            expect(data[0].days[0][0].courtRoom).equal('Courtroom 2');
            expect(data[0].days[0][1].courtRoom).equal(
                'to be allocated [Colchester Social Security and Child Support]'
            );
        });

        it("should append the unallocated cases at the bottom of a given day's cases", async () => {
            const data = await crownFirmListService.splitOutFirmListData(
                JSON.stringify(JSON.parse(rawCrownFirmData)),
                lng,
                languageFile
            );
            expect(data[0].days[0][1].courtRoom).contains('to be allocated');
            expect(data[1].days[1][2].courtRoom).contains('to be allocated');
        });
    });
});
