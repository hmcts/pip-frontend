import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import { MagistratesStandardListService } from '../../../../main/service/listManipulation/MagistratesStandardListService';

const magsStandardListService = new MagistratesStandardListService();
const rawMagistrateStandardListData = fs.readFileSync(
    path.resolve(__dirname, '../../mocks/magsStandardList.json'),
    'utf-8'
);

const lng = 'en';
const languageFile = 'magistrates-standard-list';

describe('Magistrate Standard List Data manipulation service', () => {
    describe('MagsStandardListService', () => {
        let magistrateStandardList;
        beforeEach(() => {
            magistrateStandardList = JSON.parse(rawMagistrateStandardListData);
        });

        it('should format the case time in 12 hour format', async () => {
            const data = await magsStandardListService.manipulatedMagsStandardListData(
                magistrateStandardList,
                lng,
                languageFile
            );
            expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['time']).to.equal(
                '2:30pm'
            );
        });

        it('should format the party information correctly', async () => {
            const data = await magsStandardListService.manipulatedMagsStandardListData(
                magistrateStandardList,
                lng,
                languageFile
            );
            expect(
                data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['defendants'][0]['defendantHeading']
            ).to.equal('Surname1, John Smith1 (male)*');
            expect(
                data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['defendants'][0]['defendantInfo'][0][
                    'defendantDateOfBirth'
                ]
            ).to.equal('01/01/1983');
            expect(
                data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['defendants'][0]['defendantInfo'][0][
                    'defendantAddress'
                ]
            ).to.equal('Address Line 1, Address Line 2, Month A, County A, AA1 AA1');
            expect(
                data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['defendants'][0]['defendantInfo'][0][
                    'age'
                ]
            ).to.equal(39);
            expect(
                data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['defendants'][0]['defendantInfo'][0][
                    'gender'
                ]
            ).to.equal('male');
            expect(
                data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['defendants'][0]['defendantInfo'][0][
                    'allOffences'
                ][0]['plea']
            ).to.equal('NOT_GUILTY');
        });

        it('should format conviction and adjournedDate date correctly', async () => {
            const data = await magsStandardListService.manipulatedMagsStandardListData(
                magistrateStandardList,
                lng,
                languageFile
            );
            expect(
                data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['defendants'][0]['defendantInfo'][0][
                    'allOffences'
                ][0]['formattedConvictionDate']
            ).to.equal('14/09/2016');
            expect(
                data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['defendants'][0]['defendantInfo'][0][
                    'allOffences'
                ][0]['formattedAdjournedDate']
            ).to.equal('14/09/2016');
        });
    });
});
