import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import { CrimeListsService } from '../../../../main/service/listManipulation/CrimeListsService';

const crimeListsService = new CrimeListsService();
const rawCrownDailyData = fs.readFileSync(path.resolve(__dirname, '../../mocks/crownDailyList.json'), 'utf-8');
const rawCrimePartyData = fs.readFileSync(path.resolve(__dirname, '../../mocks/crimeListParty.json'), 'utf-8');

const lng = 'en';
const languageFile = 'crown-daily-list';

describe('Crime Data manipulation service', () => {
    describe('CrimeListsDataManipulatedService', () => {
        let crownDailyCause;
        beforeEach(() => {
            crownDailyCause = JSON.parse(rawCrownDailyData);
        });

        it('should formatted the case time in 12 hours format', async () => {
            const data = await crimeListsService.manipulateCrimeListData(
                JSON.stringify(crownDailyCause),
                lng,
                languageFile
            );
            expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['time']).to.equal(
                '10:40am'
            );
            expect(data['courtLists'][2]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['time']).to.equal(
                '1:00pm'
            );
        });

        it('should formatted the party information correctly for prosecution authority and defendant', async () => {
            const data = await crimeListsService.manipulateCrimeListData(
                JSON.stringify(crownDailyCause),
                lng,
                languageFile
            );
            expect(
                data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][0][
                    'defendant'
                ]
            ).to.equal('Defendant_SN, Defendant_FN');
            expect(
                data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][0][
                    'prosecutingAuthority'
                ]
            ).to.equal('Pro_Auth');
        });

        it('should be able to find linked cases for a particular case', async () => {
            const data = await crimeListsService.manipulateCrimeListData(
                JSON.stringify(crownDailyCause),
                lng,
                languageFile
            );
            expect(
                data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][0][
                    'case'
                ][0]['linkedCases']
            ).to.equal('caseid111, caseid222');
            expect(
                data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][0][
                    'case'
                ][1]['linkedCases']
            ).to.equal('');
        });

        it('should be able to find listing notes for a particular hearing', async () => {
            const data = await crimeListsService.manipulateCrimeListData(
                JSON.stringify(crownDailyCause),
                lng,
                languageFile
            );
            expect(
                data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][0][
                    'listingNotes'
                ]
            ).to.equal('Listing details text');
            expect(
                data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][1][
                    'listingNotes'
                ]
            ).to.equal('');
        });

        it('should append the unallocated cases at the bottom of the courtList', async () => {
            const data = await crimeListsService.findUnallocatedCasesInCrownDailyListData(
                JSON.stringify(crownDailyCause)
            );
            expect(data['courtLists'].length).to.equal(5);
            expect(data['courtLists'][4]['unallocatedCases']).to.equal(true);
            expect(data['courtLists'][4]['courtHouse']['courtRoom'][0]['courtRoomName']).to.equal('to be allocated');
        });
    });

    describe('manipulateParty', () => {
        let partyData;
        beforeEach(() => {
            partyData = JSON.parse(rawCrimePartyData);
        });

        it('should format single defendant and prosecuting authority', async () => {
            const hearing = partyData.hearing[0];
            crimeListsService.manipulateParty(hearing);
            expect(hearing.defendant).to.equal('Surname, Forenames');
            expect(hearing.defendantRepresentative).to.equal('Defendant rep name');
            expect(hearing.prosecutingAuthority).to.equal('Prosecuting authority name');
        });

        it('should format multiple defendants and prosecuting authorities', async () => {
            const hearing = partyData.hearing[1];
            crimeListsService.manipulateParty(hearing);
            expect(hearing.defendant).to.equal('SurnameA, ForenamesA, SurnameB, ForenamesB');
            expect(hearing.defendantRepresentative).to.equal('Defendant rep nameA, Defendant rep nameB');
            expect(hearing.prosecutingAuthority).to.equal('Prosecuting authority nameA, Prosecuting authority nameB');
        });
    });
});
