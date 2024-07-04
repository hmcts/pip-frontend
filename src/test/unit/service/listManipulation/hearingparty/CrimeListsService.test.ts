import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import { CrimeListsService } from '../../../../../main/service/listManipulation/CrimeListsService';

const crimeListsService = new CrimeListsService();
const rawCrownDailyData = fs.readFileSync(
    path.resolve(__dirname, '../../../mocks/crownDailyList.json'),
    'utf-8'
);
const rawCrimePartyData = fs.readFileSync(path.resolve(__dirname, '../../../mocks/crimeListParty.json'), 'utf-8');
const rawAddressData = fs.readFileSync(path.resolve(__dirname, '../../../mocks/address.json'), 'utf-8');

describe('Crime Data manipulation service', () => {
    describe('CrimeListsDataManipulatedService', () => {
        let crownDailyCause;
        beforeEach(() => {
            crownDailyCause = JSON.parse(rawCrownDailyData);
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

    describe('formatAddress', () => {
        const addressData = JSON.parse(rawAddressData);

        it('should remove empty address lines in formatted address', async () => {
            const formattedAddress = crimeListsService.formatAddress(addressData.address[0]);
            expect(formattedAddress).to.equal('Address Line 1\nAddress Line 2\nTown\nCounty\nAA1 1AA');
        });

        it('should format address with missing address elements', async () => {
            const formattedAddress = crimeListsService.formatAddress(addressData.address[1]);
            expect(formattedAddress).to.equal('Town\nAA1 1AA');
        });

        it('should format address with custom delimiter', async () => {
            const formattedAddress = crimeListsService.formatAddress(addressData.address[0], ', ');
            expect(formattedAddress).to.equal('Address Line 1, Address Line 2, Town, County, AA1 1AA');
        });
    });
});
