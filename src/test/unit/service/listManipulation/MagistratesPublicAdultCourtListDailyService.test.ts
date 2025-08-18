import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import { MagistratesPublicAdultCourtListDailyService }
    from '../../../../main/service/listManipulation/MagistratesPublicAdultCourtListDailyService';

const magistratesPublicAdultCourtListService = new MagistratesPublicAdultCourtListDailyService();
const rawListData = fs.readFileSync(
    path.resolve(__dirname, '../../mocks/magistratesPublicAdultCourtListDaily.json'),
    'utf-8'
);

describe('Magistrate Public Adult Court List service', () => {
    describe('process payload', () => {
        it('should have correct result count', async () => {
            const results = magistratesPublicAdultCourtListService.processPayload(JSON.parse(rawListData));
            expect(results).to.have.length(2);
            expect(results[0].cases).to.have.length(2);
            expect(results[1].cases).to.have.length(2);
        });

        it('should format court and session info', async () => {
            const results = magistratesPublicAdultCourtListService.processPayload(JSON.parse(rawListData));
            expect(results[0].lja).to.equal('North Northumbria Magistrates\' Court');
            expect(results[0].courtName).to.equal('North Shields Magistrates\' Court');
            expect(results[0].courtRoom).to.equal(1);
            expect(results[0].sessionStartTime).to.equal('9am');
        });

        it('should format case info', async () => {
            const results = magistratesPublicAdultCourtListService.processPayload(JSON.parse(rawListData));
            const cases = results[0].cases[0];
            expect(cases.blockStartTime).to.equal('9am');
            expect(cases.caseNumber).to.equal('1000000000');
            expect(cases.defendantName).to.equal('Mr Test User');
        });
    });
});
