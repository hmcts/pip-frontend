import { hearingHasParty } from '../../../main/helpers/listHelper';
import fs from 'fs';
import path from 'path';

describe('List helper', () => {
    it('Hearing should have party', () => {
        const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/hearingparty/crownDailyList.json'), 'utf-8');
        expect(hearingHasParty(JSON.stringify(rawData))).toBeTruthy();
    });

    it('Hearing should have no party', () => {
        const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/crownDailyList.json'), 'utf-8');
        expect(hearingHasParty(rawData)).toBeFalsy();
    });
});
