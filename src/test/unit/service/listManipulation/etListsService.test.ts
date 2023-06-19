import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import { EtListsService } from '../../../../main/service/listManipulation/EtListsService';

const etListsService = new EtListsService();
const etDailyListData = fs.readFileSync(path.resolve(__dirname, '../../mocks/etDailyList.json'), 'utf-8');

describe('Reshaped ET Fortnightly List - splitting data from a courtroom format to a day by day view.', () => {
    it('should return ET Fortnightly List', async () => {
        const data = await etListsService.reshapeEtFortnightlyListData(etDailyListData, 'en');
        expect(JSON.stringify(data).length).to.equal(2842);
    });

    it('should match the completed mock', async () => {
        const data = await etListsService.reshapeEtFortnightlyListData(etDailyListData, 'en');
        expect(JSON.stringify(data)).to.contain('Mr T. Test Surname 2');
    });

    it('should have data for two courthouses', async () => {
        const data = JSON.stringify(await etListsService.reshapeEtFortnightlyListData(etDailyListData, 'en'));
        expect(data).to.contain('Leicester Crown Court');
        expect(data).to.contain('Nottingham Justice Centre');
    });

    it('should have exactly one record for Leicester', async () => {
        const data = await etListsService.reshapeEtFortnightlyListData(etDailyListData, 'en');
        expect(data[0]['courtName']).to.equal('Leicester Crown Court');
        expect(JSON.stringify(data).match('Leicester Crown Court').length).to.equal(1);
    });

    it('should have exactly four records for Nottingham', async () => {
        const data = JSON.stringify(await etListsService.reshapeEtFortnightlyListData(etDailyListData, 'en'));
        // the reason this is equal to 5 initially is the parent object also includes the court name as a descriptor
        expect(data.match(new RegExp('Nottingham Justice Centre', 'g')).length - 1).to.equal(4);
    });

    it('should be parsing and separating dates correctly', async () => {
        const data = JSON.stringify(await etListsService.reshapeEtFortnightlyListData(etDailyListData, 'en'));
        const list_of_dates = ['Sunday 13 February 2022'];
        list_of_dates.forEach(value => {
            expect(data).to.contain(value);
        });
    });
});
