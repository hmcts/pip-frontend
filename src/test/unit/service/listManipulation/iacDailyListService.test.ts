import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import { IacDailyListService } from '../../../../main/service/listManipulation/IacDailyListService';

const iacService = new IacDailyListService();

describe('IAC Daily List service', () => {
    describe('manipulateIacDailyListData', () => {
        const rawIacDailyListData = fs.readFileSync(path.resolve(__dirname, '../../mocks/iacDailyList.json'), 'utf-8');

        it('should return all court lists', async () => {
            const data = await iacService.manipulateIacDailyListData(rawIacDailyListData, 'en');
            expect(data['courtLists'].length).to.equal(2);
        });

        it('should format start time of Hearing', async () => {
            const data = await iacService.manipulateIacDailyListData(rawIacDailyListData, 'en');
            expect(
                data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0][
                    'sittingStartFormatted'
                ]
            ).to.equal('11:30am');
        });

        it('should format single judiciary', async () => {
            const data = await iacService.manipulateIacDailyListData(rawIacDailyListData, 'en');
            expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['formattedJudiciary']).to.equal(
                'Judge Jacobs'
            );
        });

        it('should format multiple judiciaries', async () => {
            const data = await iacService.manipulateIacDailyListData(rawIacDailyListData, 'en');
            expect(data['courtLists'][1]['courtHouse']['courtRoom'][0]['session'][0]['formattedJudiciary']).to.equal(
                'Judge Jacobs, Magistrate Jones, Magistrate Patel'
            );
        });

        it('should use sitting channel for hearing case', async () => {
            const data = await iacService.manipulateIacDailyListData(rawIacDailyListData, 'en');
            expect(
                data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['caseHearingChannel']
            ).to.equal('Teams, Attended');
        });

        it('should use session channel for hearing case', async () => {
            const data = await iacService.manipulateIacDailyListData(rawIacDailyListData, 'en');
            expect(
                data['courtLists'][1]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['caseHearingChannel']
            ).to.equal('Video Hearing, Attended');
        });

        it('should format hearing parties', async () => {
            const data = await iacService.manipulateIacDailyListData(rawIacDailyListData, 'en');
            const hearing =
                data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][0];
            expect(hearing['appellant']).to.equal('Mr Steve M Taylor');
            expect(hearing['appellantRepresentative']).to.equal('JCT Law Centre');
            expect(hearing['prosecutingAuthority']).to.equal('Entry Clearance Officer');
        });

        it('should format hearing parties with no appellant representative', async () => {
            const data = await iacService.manipulateIacDailyListData(rawIacDailyListData, 'en');
            const hearing =
                data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][1];
            expect(hearing['appellant']).to.equal('Mr Steve M Taylor');
            expect(hearing['appellantRepresentative']).to.equal('');
            expect(hearing['prosecutingAuthority']).to.equal('Entry Clearance Officer');
        });

        it('should format hearing parties with multiple appellants and respondents', async () => {
            const data = await iacService.manipulateIacDailyListData(rawIacDailyListData, 'en');
            const hearing =
                data['courtLists'][1]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][0];
            expect(hearing['appellant']).to.equal('Mr Steve M Taylor, Mrs Rose Taylor');
            expect(hearing['appellantRepresentative']).to.equal('JCT Law Centre');
            expect(hearing['prosecutingAuthority']).to.equal('Entry Clearance Officer, Secretary of State');
        });

        it('should format single linked case', async () => {
            const data = await iacService.manipulateIacDailyListData(rawIacDailyListData, 'en');
            expect(
                data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][0][
                    'case'
                ][0]['formattedLinkedCases']
            ).to.equal('1234');
        });

        it('should format multiple linked cases', async () => {
            const data = await iacService.manipulateIacDailyListData(rawIacDailyListData, 'en');
            expect(
                data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][1][
                    'case'
                ][0]['formattedLinkedCases']
            ).to.equal('123, 456, 999');
        });
    });
});
