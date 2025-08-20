import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import {
    MagistratesAdultCourtListService
} from '../../../../main/service/listManipulation/MagistratesAdultCourtListService';

const magistratesAdultCourtListService = new MagistratesAdultCourtListService();
const rawListData = fs.readFileSync(
    path.resolve(__dirname, '../../mocks/magistratesAdultCourtList.json'),
    'utf-8'
);

const lng = 'en';

describe('Magistrate Adult Court List service', () => {
    describe('process payload when standard', () => {
        it('should have correct result count', async () => {
            const results = await magistratesAdultCourtListService.processPayload(JSON.parse(rawListData), lng, true);
            expect(results).to.have.length(2);
            expect(results[0].cases).to.have.length(2);
            expect(results[1].cases).to.have.length(2);
        });

        it('should format court and session info', async () => {
            const results = await magistratesAdultCourtListService.processPayload(JSON.parse(rawListData), lng, true);
            expect(results[0].lja).to.equal('North Northumbria Magistrates\' Court');
            expect(results[0].courtName).to.equal('North Shields Magistrates\' Court');
            expect(results[0].courtRoom).to.equal(1);
            expect(results[0].sessionStartTime).to.equal('9am');
        });

        it('should format case info', async () => {
            const results = await magistratesAdultCourtListService.processPayload(JSON.parse(rawListData), lng, true);
            const cases = results[0].cases[0];
            expect(cases.blockStartTime).to.equal('9am');
            expect(cases.caseNumber).to.equal('1000000000');
            expect(cases.defendantName).to.equal('Mr Test User');
            expect(cases.defendantDob).to.equal('06/11/1975');
            expect(cases.defendantAge).to.equal(50);
            expect(cases.defendantAddress).to.equal('1 High Street, London, SW1A 1AA');
            expect(cases.informant).to.equal('POL01');
        });

        it('should format offence info', async () => {
            const results = await magistratesAdultCourtListService.processPayload(JSON.parse(rawListData), lng, true);
            const offence = results[0].cases[0].offence;
            expect(offence.offenceCode).to.equal('TH68001');
            expect(offence.offenceTitle).to.equal('Offence title 1');
            expect(offence.offenceSummary).to.equal('Offence summary 1');
        });
    });

    describe('process payload when public', () => {
        it('should have correct result count', async () => {
            const results = await magistratesAdultCourtListService.processPayload(JSON.parse(rawListData), lng, false);
            expect(results).to.have.length(2);
            expect(results[0].cases).to.have.length(2);
            expect(results[1].cases).to.have.length(2);
        });

        it('should format court and session info', async () => {
            const results = await magistratesAdultCourtListService.processPayload(JSON.parse(rawListData), lng, false);
            expect(results[0].lja).to.equal('North Northumbria Magistrates\' Court');
            expect(results[0].courtName).to.equal('North Shields Magistrates\' Court');
            expect(results[0].courtRoom).to.equal(1);
            expect(results[0].sessionStartTime).to.equal('9am');
        });

        it('should format case info', async () => {
            const results = await magistratesAdultCourtListService.processPayload(JSON.parse(rawListData), lng, false);
            const cases = results[0].cases[0];
            expect(Object.keys(cases)).to.have.length(3);
            expect(cases.blockStartTime).to.equal('9am');
            expect(cases.caseNumber).to.equal('1000000000');
            expect(cases.defendantName).to.equal('Mr Test User');
        });
    });
});
