import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import { TribunalNationalListsService } from '../../../../main/service/listManipulation/TribunalNationalListsService';

const tribunalNationalListsService = new TribunalNationalListsService();

const testData = fs.readFileSync(path.resolve(__dirname, '../../mocks/primaryHealthList.json'), 'utf-8');

const lng = 'en';
const languageFile = 'care-standards-list';

describe('Tribunal National Lists Service', () => {
    it('Should have added Hearing Date to the formatted response', () => {
        const data = tribunalNationalListsService.manipulateData(testData, lng, languageFile);
        expect(data[0].hearingDate).to.contain('04 October');
    });

    it('Should have added case Name to the formatted response', () => {
        const data = tribunalNationalListsService.manipulateData(testData, lng, languageFile);
        expect(data[0].caseName).to.contain('A Vs B');
    });

    it('Should have added duration as days to the formatted response', () => {
        const data = tribunalNationalListsService.manipulateData(testData, lng, languageFile);
        expect(data[0].durationAsDays).to.equal(1);
    });

    it('Should have added duration as hours to the formatted response', () => {
        const data = tribunalNationalListsService.manipulateData(testData, lng, languageFile);
        expect(data[0].durationAsHours).to.equal(24);
    });

    it('Should have added duration as minutes to the formatted response', () => {
        const data = tribunalNationalListsService.manipulateData(testData, lng, languageFile);
        expect(data[0].durationAsMinutes).to.equal(30);
    });

    it('Should have added case sequence Indicator to the formatted response', () => {
        const data = tribunalNationalListsService.manipulateData(testData, lng, languageFile);
        expect(data[0].caseSequenceIndicator).to.equal('2 of 3');
    });

    it('Should have added haring type to the formatted response', () => {
        const data = tribunalNationalListsService.manipulateData(testData, lng, languageFile);
        expect(data[0].hearingType).to.equal('Remote - Teams');
    });

    it('Should have added venue to the formatted response', () => {
        const data = tribunalNationalListsService.manipulateData(testData, lng, languageFile);
        expect(data[0].venue).to.equal('PRESTON\nAddress Line 1\nAA1 AA1');
    });

    it('Should have added venue with blank court house name and address line to formatted response', () => {
        const data = tribunalNationalListsService.manipulateData(testData, lng, languageFile);
        expect(data[1].venue).to.equal('Address Line 1\nAddress Line 2\nAA1 AA1');
    });
});
