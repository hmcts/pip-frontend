import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import { MagistratesStandardListService } from '../../../../main/service/listManipulation/MagistratesStandardListService';

const magistratesStandardListService = new MagistratesStandardListService();
const rawMagistrateStandardListData = fs.readFileSync(
    path.resolve(__dirname, '../../mocks/magistratesStandardList.json'),
    'utf-8'
);

const lng = 'en';
const courtRoom1 = 'Courtroom 1: Judge KnownAs Presiding, Judge KnownAs';
const courtRoom2 = 'Courtroom 2: Judge KnownAs Presiding 2, Judge KnownAs 2';

describe('Magistrate Standard List service', () => {
    describe('manipulate data', () => {
        it('should format courtRoom and Judiciary', async () => {
            const data = await magistratesStandardListService.manipulateData(rawMagistrateStandardListData, lng);
            expect(data.size).to.equal(2);

            const keyIterator = data.keys();
            expect(keyIterator.next().value).to.equal(courtRoom1);
            expect(keyIterator.next().value).to.equal(courtRoom2);
        });

        it('should format defendant headings', async () => {
            const data = await magistratesStandardListService.manipulateData(rawMagistrateStandardListData, lng);

            const cases = data.get(courtRoom1);
            expect(cases).to.have.length(3);
            expect(cases[0]['defendantHeading']).to.equal('Surname1, Forename1 (male)*');
            expect(cases[1]['defendantHeading']).to.equal('Surname2, Forename2 (male)*');
            expect(cases[2]['defendantHeading']).to.equal('Surname3, Forename3 (male)*');

            const cases2 = data.get(courtRoom2);
            expect(cases2).to.have.length(3);
            expect(cases2[0]['defendantHeading']).to.equal('Surname4, Forename4 (male)*');
            expect(cases2[1]['defendantHeading']).to.equal('Surname5, Forename5 (male)*');
            expect(cases2[2]['defendantHeading']).to.equal('Surname6, Forename6 (male)*');
        });

        it('should format case sittings', async () => {
            const data = await magistratesStandardListService.manipulateData(rawMagistrateStandardListData, lng);
            const cases = data.get(courtRoom1);
            const caseSittings = cases[0]['caseSittings'];

            expect(caseSittings).to.have.length(1);
            expect(caseSittings[0]['sittingStartTime']).to.equal('1:30pm');
            expect(caseSittings[0]['sittingDuration']).to.equal('2 hours 30 mins');
        });

        it('should format defendant info', async () => {
            const data = await magistratesStandardListService.manipulateData(rawMagistrateStandardListData, lng);
            const cases = data.get(courtRoom1);
            const defendantInfo = cases[0]['caseSittings'][0]['defendantInfo'];

            expect(defendantInfo['dob']).to.equal('01/01/1983');
            expect(defendantInfo['age']).to.equal(39);
            expect(defendantInfo['address']).to.equal('Address Line 1, Address Line 2, Month A, County A, AA1 AA1');
            expect(defendantInfo['plea']).to.equal('NOT_GUILTY');
            expect(defendantInfo['pleaDate']).to.equal('Need to confirm');
        });

        it('should format case info', async () => {
            const data = await magistratesStandardListService.manipulateData(rawMagistrateStandardListData, lng);
            const cases = data.get(courtRoom1);
            const caseInfo = cases[0]['caseSittings'][0]['caseInfo'];

            expect(caseInfo['prosecutingAuthorityCode']).to.equal('Test1234');
            expect(caseInfo['hearingNumber']).to.equal('12');
            expect(caseInfo['attendanceMethod']).to.equal('VIDEO HEARING');
            expect(caseInfo['caseNumber']).to.equal('45684548');
            expect(caseInfo['caseSequenceIndicator']).to.equal('2 of 3');
            expect(caseInfo['asn']).to.equal('Need to confirm');
            expect(caseInfo['hearingType']).to.equal('mda');
            expect(caseInfo['panel']).to.equal('ADULT');
            expect(caseInfo['convictionDate']).to.equal('13/12/2023');
            expect(caseInfo['adjournedDate']).to.equal('13/12/2023');
        });

        it('should format offences', async () => {
            const data = await magistratesStandardListService.manipulateData(rawMagistrateStandardListData, lng);
            const cases = data.get(courtRoom1);
            const offences = cases[0]['caseSittings'][0]['offences'];

            expect(offences[0]['offenceTitle']).to.equal('drink driving');
            expect(offences[0]['offenceWording']).to.equal('driving whilst under the influence of alcohol');
            expect(offences[1]['offenceTitle']).to.equal('Assault by beating');
            expect(offences[1]['offenceWording']).to.equal('Assault by beating');
        });
    });
});
