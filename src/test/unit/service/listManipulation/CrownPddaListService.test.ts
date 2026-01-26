import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import { CrownPddaListService } from '../../../../main/service/listManipulation/CrownPddaListService';
import { describe } from '@jest/globals';

const crownPddaListService = new CrownPddaListService();

const lng = 'en';
const listTypeDaily = 'crown-daily-pdda-list';
const listTypeFirm = 'crown-firm-pdda-list';
const rawDailyListData = fs.readFileSync(path.resolve(__dirname, '../../mocks/crownDailyPddaList.json'), 'utf-8');
const rawFirmListData = fs.readFileSync(path.resolve(__dirname, '../../mocks/crownFirmPddaList.json'), 'utf-8');

describe('Crown PDDA List service', () => {
    describe('Process payload for daily list', () => {
        it('should have correct result count', async () => {
            const results = await crownPddaListService.processPayload(JSON.parse(rawDailyListData), lng, listTypeDaily);
            expect(results).to.have.length(2);
            expect(results[0].sittings).to.have.length(1);
            expect(results[1].sittings).to.have.length(2);
        });

        it('should format courthouse info', async () => {
            const results = await crownPddaListService.processPayload(JSON.parse(rawDailyListData), lng, listTypeDaily);
            expect(results[0].sittingDate).to.be.empty;
            expect(results[0].courtName).to.equal('TestCourtHouseName');
            expect(results[0].courtAddress).to.have.length(3);
            expect(results[0].courtAddress[0]).to.equal('1 Main Road');
            expect(results[0].courtAddress[1]).to.equal('London');
            expect(results[0].courtAddress[2]).to.equal('A1 1AA');
            expect(results[0].courtPhone).to.equal('02071234568');
        });

        it('should format sitting info', async () => {
            const results = await crownPddaListService.processPayload(JSON.parse(rawDailyListData), lng, listTypeDaily);
            const sitting = results[0].sittings[0];
            expect(sitting.courtRoomNumber).to.equal(1);
            expect(sitting.sittingAt).to.equal('10am');
            expect(sitting.judgeName).to.equal('TestJudgeRequested, Ms TestJusticeForename TestJusticeSurname Sr');
            expect(sitting.hearings).to.have.length(1);
        });

        it('should format hearing info', async () => {
            const results = await crownPddaListService.processPayload(JSON.parse(rawDailyListData), lng, listTypeDaily);
            const hearing = results[0].sittings[0].hearings[0];
            expect(hearing.caseNumber).to.equal('T00112233');
            expect(hearing.defendantName).to.equal(
                '' + 'TestDefendantRequestedName, Mr TestDefendantForename TestDefendantSurname TestDefendantSuffix'
            );
            expect(hearing.hearingType).to.equal('TestHearingDescription');
            expect(hearing.representativeName).to.be.empty;
            expect(hearing.prosecutingAuthority).to.equal('Crown Prosecution Service');
            expect(hearing.listNote).to.equal('TestListNote');
        });
    });

    describe('Process payload for firm list', () => {
        it('should have correct result count', async () => {
            const results = await crownPddaListService.processPayload(JSON.parse(rawFirmListData), lng, listTypeFirm);
            expect(results).to.have.length(2);
            expect(results[0].sittings).to.have.length(1);
            expect(results[1].sittings).to.have.length(2);
        });

        it('should format courthouse info', async () => {
            const results = await crownPddaListService.processPayload(JSON.parse(rawFirmListData), lng, listTypeFirm);
            expect(results[0].sittingDate).to.equal('Wednesday 10 September 2025');
            expect(results[0].courtName).to.equal('TestCourtHouseName');
            expect(results[0].courtAddress).to.have.length(3);
            expect(results[0].courtAddress[0]).to.equal('1 Main Road');
            expect(results[0].courtAddress[1]).to.equal('London');
            expect(results[0].courtAddress[2]).to.equal('A1 1AA');
            expect(results[0].courtPhone).to.equal('02071234568');
        });

        it('should format sitting info', async () => {
            const results = await crownPddaListService.processPayload(JSON.parse(rawFirmListData), lng, listTypeFirm);
            const sitting = results[0].sittings[0];
            expect(sitting.courtRoomNumber).to.equal(1);
            expect(sitting.sittingAt).to.equal('10am');
            expect(sitting.judgeName).to.equal('TestJudgeRequested, Ms TestJusticeForename TestJusticeSurname Sr');
            expect(sitting.hearings).to.have.length(1);
        });

        it('should format hearing info', async () => {
            const results = await crownPddaListService.processPayload(JSON.parse(rawFirmListData), lng, listTypeFirm);
            const hearing = results[0].sittings[0].hearings[0];
            expect(hearing.caseNumber).to.equal('T00112233');
            expect(hearing.defendantName).to.equal(
                '' +
                    'Mr TestDefendantForename1 TestDefendantForename2 TestDefendantSurname TestDefendantSuffix, Mr TestDefendantForename TestDefendantSurname TestDefendantSuffix'
            );
            expect(hearing.hearingType).to.equal('TestHearingDescription');
            expect(hearing.representativeName).to.equal('TestSolicitorRequestedName');
            expect(hearing.prosecutingAuthority).to.equal('Crown Prosecution Service');
            expect(hearing.listNote).to.equal('TestListNote');
        });
    });

    it('should format address', async () => {
        const input = {
            Line: ['1 Main Road', 'London'],
            PostCode: 'A1 1AA',
        };

        const result = crownPddaListService.formatAddress(input);
        expect(result).to.have.length(3);
        expect(result[0]).to.equal('1 Main Road');
        expect(result[1]).to.equal('London');
        expect(result[2]).to.equal('A1 1AA');
    });

    it('should convert to ISO date', async () => {
        expect(crownPddaListService.toIsoDate('2025-01-10')).to.equal('2025-01-10T00:00:00.000Z');
    });
});
