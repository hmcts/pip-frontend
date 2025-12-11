import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import { CrownWarnedPddaListService } from '../../../../main/service/listManipulation/CrownWarnedPddaListService';

const crownWarnedPddaListService = new CrownWarnedPddaListService();

describe('Crown Warned PDDA List service', () => {
    describe('processPayload', () => {
        const payload = fs.readFileSync(path.resolve(__dirname, '../../mocks/crownWarnedPddaList.json'), 'utf-8');
        const parsedPayload = JSON.parse(payload);
        it('should return all hearing types', async () => {
            const data = crownWarnedPddaListService.processPayload(parsedPayload);
            expect(data.size).to.equal(4);

            const keyIterator = data.keys();
            expect(keyIterator.next().value).is.equal('For Trial');
            expect(keyIterator.next().value).is.equal('For Appeal');
            expect(keyIterator.next().value).is.equal('For Sentence');
            expect(keyIterator.next().value).is.equal('To be allocated');
        });

        it('should format dependant name', async () => {
            const data: Map<string, object[]> = await crownWarnedPddaListService.processPayload(parsedPayload);
            const cases = data.get('For Trial');
            expect(cases[0]['defendantNames']).is.equal('Mr Pete Paul Dan Y');
        });

        it('should format dependant names for second hearing', async () => {
            const data: Map<string, object[]> = await crownWarnedPddaListService.processPayload(parsedPayload);
            const cases = data.get('For Appeal');
            expect(cases[0]['defendantNames']).is.equal('Mr Pete Paul Dan Y');
        });

        it('should format fixed date', async () => {
            const data: Map<string, object[]> = await crownWarnedPddaListService.processPayload(parsedPayload);
            const cases = data.get('For Trial');
            expect(cases[0]['fixedDate']).is.equal('01/01/2024');
        });

        it('should return case reference number', async () => {
            const data: Map<string, object[]> = await crownWarnedPddaListService.processPayload(parsedPayload);
            const cases = data.get('For Trial');
            expect(cases[0]['caseReference']).is.equal('T20237000');
        });

        it('should return prosecuting authority', async () => {
            const data: Map<string, object[]> = await crownWarnedPddaListService.processPayload(parsedPayload);
            const cases = data.get('For Trial');
            expect(cases[0]['prosecutingAuthority']).is.equal('Crown Prosecution Service');
        });

        it('should format linked cases if exists', async () => {
            const data: Map<string, object[]> = await crownWarnedPddaListService.processPayload(parsedPayload);
            const cases = data.get('For Trial');
            expect(cases[0]['linkedCases']).is.equal('TestLinkedCaseNumber');
        });

        it('should return listing notes', async () => {
            const data: Map<string, object[]> = await crownWarnedPddaListService.processPayload(parsedPayload);
            const cases = data.get('For Trial');
            expect(cases[0]['listingNotes']).is.equal('TestListNote');
        });
    });
});
