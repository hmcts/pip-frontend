import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import { CrownWarnedListService } from '../../../../main/service/listManipulation/CrownWarnedListService';

const crownWarnedListService = new CrownWarnedListService();

describe('Crown Warned List service', () => {
    describe('manipulateData', () => {
        const rawData = fs.readFileSync(path.resolve(__dirname, '../../mocks/crownWarnedList.json'), 'utf-8');
        const input = JSON.stringify(JSON.parse(rawData));

        it('should return all hearing types', async () => {
            const data = await crownWarnedListService.manipulateData(input, 'en');
            expect(data.size).to.equal(6);

            const keyIterator = data.keys();
            expect(keyIterator.next().value).is.equal('Trial');
            expect(keyIterator.next().value).is.equal('Pre-Trial review');
            expect(keyIterator.next().value).is.equal('Appeal');
            expect(keyIterator.next().value).is.equal('Appeal against Conviction');
            expect(keyIterator.next().value).is.equal('Sentence');
            expect(keyIterator.next().value).is.equal('To be allocated');
        });

        it('should format single dependant name', async () => {
            const data: Map<string, object[]> = await crownWarnedListService.manipulateData(input, 'en');
            const cases = data.get('Trial');
            expect(cases[0]['defendant']).is.equal('Kelly, Smith');
        });

        it('should format multiple dependant names', async () => {
            const data: Map<string, object[]> = await crownWarnedListService.manipulateData(input, 'en');
            const cases = data.get('Appeal');
            expect(cases[1]['defendant']).is.equal('Jenson, Mia, Jenson, Thomas');
        });

        it('should format hearing date', async () => {
            const data: Map<string, object[]> = await crownWarnedListService.manipulateData(input, 'en');
            const cases = data.get('Trial');
            expect(cases[0]['hearingDate']).is.equal('27/07/2022');
        });

        it('should return defendant representative from organisation details', async () => {
            const data: Map<string, object[]> = await crownWarnedListService.manipulateData(input, 'en');
            const cases = data.get('Trial');
            expect(cases[0]['defendantRepresentative']).is.equal('Defendant rep 1');
        });

        it('should return prosecuting authority from organisation details', async () => {
            const data: Map<string, object[]> = await crownWarnedListService.manipulateData(input, 'en');
            const cases = data.get('Trial');
            expect(cases[0]['prosecutingAuthority']).is.equal('Prosecutor');
        });

        it('should format linked cases if exists', async () => {
            const data: Map<string, object[]> = await crownWarnedListService.manipulateData(input, 'en');
            const cases = data.get('Trial');
            expect(cases[0]['linkedCases']).is.equal('123456, 123457');
        });

        it('should return empty string if linked cases missing', async () => {
            const data: Map<string, object[]> = await crownWarnedListService.manipulateData(input, 'en');
            const cases = data.get('Trial');
            expect(cases[1]['linkedCases']).is.equal('');
        });

        it('should return listing notes', async () => {
            const data: Map<string, object[]> = await crownWarnedListService.manipulateData(input, 'en');
            const cases = data.get('Trial');
            expect(cases[0]['listingNotes']).is.equal('Note 1');
        });
    });

    describe('formatContentDate', () => {
        it('should return the past Monday if date is not Monday', async () => {
            const result = crownWarnedListService.formatContentDate('2022-09-13T11:30:52.123Z', 'en');
            expect(result).is.equal('12 September 2022');
        });

        it('should return the same date if date is Monday', async () => {
            const result = crownWarnedListService.formatContentDate('2022-09-12T11:30:52.123Z', 'en');
            expect(result).is.equal('12 September 2022');
        });
    });
});
