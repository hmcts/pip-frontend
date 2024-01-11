import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import { OpaResultsService } from '../../../../main/service/listManipulation/OpaResultsService';

const opaResultsService = new OpaResultsService();

const language = 'en';
const decisionDate1 = '07 January 2024';
const decisionDate2 = '06 January 2024';
const decisionDate3 = '05 January 2024';

describe('OPA Results service', () => {
    const rawData = fs.readFileSync(path.resolve(__dirname, '../../mocks/opaResults.json'), 'utf-8');
    const input = JSON.stringify(JSON.parse(rawData));

    it('should return all decision dates', async () => {
        const data = await opaResultsService.manipulateData(input, language);
        expect(data.size).to.equal(3);

        const keyIterator = data.keys();
        expect(keyIterator.next().value).is.equal(decisionDate1);
        expect(keyIterator.next().value).is.equal(decisionDate2);
        expect(keyIterator.next().value).is.equal(decisionDate3);
    });

    it('should return a single case for a decision date', async () => {
        const data: Map<string, object[]> = await opaResultsService.manipulateData(input, language);
        const cases = data.get(decisionDate1);
        expect(cases).to.have.length(1);
    });

    it('should return multiple cases for a decision date', async () => {
        const data: Map<string, object[]> = await opaResultsService.manipulateData(input, language);
        const cases = data.get(decisionDate3);
        expect(cases).to.have.length(2);
    });

    it('should format individual dependant name', async () => {
        const data: Map<string, object[]> = await opaResultsService.manipulateData(input, language);
        const cases = data.get(decisionDate2);
        expect(cases[0]['defendant']).is.equal('Surname 2, Forename 2 MiddleName 2');
    });

    it('should return organisation dependant name', async () => {
        const data: Map<string, object[]> = await opaResultsService.manipulateData(input, language);
        const cases = data.get(decisionDate1);
        expect(cases[0]['defendant']).is.equal('Organisation name');
    });

    it('should return case URN', async () => {
        const data: Map<string, object[]> = await opaResultsService.manipulateData(input, language);
        const cases = data.get(decisionDate1);
        expect(cases[0]['caseUrn']).is.equal('URN456');
    });

    it('should return a single offence for a case', async () => {
        const data: Map<string, object[]> = await opaResultsService.manipulateData(input, language);
        const cases = data.get(decisionDate2);

        expect(cases[0]['offences']).to.have.length(1);
        const offence1 = cases[0]['offences'][0];

        expect(offence1['offenceTitle']).is.equal('Offence title 3');
        expect(offence1['offenceSection']).is.equal('Offence section 3');
    });

    it('should return multiple offences for a case', async () => {
        const data: Map<string, object[]> = await opaResultsService.manipulateData(input, language);
        const cases = data.get(decisionDate1);

        expect(cases[0]['offences']).to.have.length(2);
        const offence1 = cases[0]['offences'][0];
        const offence2 = cases[0]['offences'][1];

        expect(offence1['offenceTitle']).is.equal('Offence title 2A');
        expect(offence1['offenceSection']).is.equal('Offence section 2A');
        expect(offence2['offenceTitle']).is.equal('Offence title 2B');
        expect(offence2['offenceSection']).is.equal('Offence section 2B');
    });

    it('should return offence details', async () => {
        const data: Map<string, object[]> = await opaResultsService.manipulateData(input, language);
        const cases = data.get(decisionDate1);
        const offence1 = cases[0]['offences'][0];

        expect(offence1['decisionDate']).is.equal('07 January 2024');
        expect(offence1['decisionDetail']).is.equal('Decision detail 2A');
        expect(offence1['bailStatus']).is.equal('Unconditional bail');
        expect(offence1['nextHearingDate']).is.equal('10 February 2024');
        expect(offence1['nextHearingLocation']).is.equal('Hearing location 2');
        expect(offence1['reportingRestrictions']).is.equal(
            'Reporting restriction detail 2, Reporting restriction detail 3'
        );
    });
});
