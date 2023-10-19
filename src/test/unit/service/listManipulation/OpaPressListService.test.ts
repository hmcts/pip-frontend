import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import { OpaPressListService } from '../../../../main/service/listManipulation/OpaPressListService';

const opaPressListService = new OpaPressListService();

const pleaDate = '22/09/2023';
const pleaDate2 = '21/09/2023';
const pleaDate3 = '20/09/2023';

describe('OPA Press List service', () => {
    const rawData = fs.readFileSync(path.resolve(__dirname, '../../mocks/opaPressList.json'), 'utf-8');
    const input = JSON.stringify(JSON.parse(rawData));

    it('should return all plea dates', async () => {
        const data = await opaPressListService.manipulateData(input);
        expect(data.size).to.equal(3);

        const keyIterator = data.keys();
        expect(keyIterator.next().value).is.equal(pleaDate);
        expect(keyIterator.next().value).is.equal(pleaDate2);
        expect(keyIterator.next().value).is.equal(pleaDate3);
    });

    it('should format individual dependant name', async () => {
        const data: Map<string, object[]> = await opaPressListService.manipulateData(input);
        const cases = data.get(pleaDate);
        expect(cases[0]['name']).is.equal('Surname2, Forename2 MiddleName2');
    });

    it('should return organisation dependant name', async () => {
        const data: Map<string, object[]> = await opaPressListService.manipulateData(input);
        const cases = data.get(pleaDate2);
        expect(cases[0]['name']).is.equal('Organisation name');
    });

    it('should format DOB and age', async () => {
        const data: Map<string, object[]> = await opaPressListService.manipulateData(input);
        const cases = data.get(pleaDate);
        expect(cases[0]['dob']).is.equal('01/01/1985');
        expect(cases[0]['age']).is.equal(38);
    });

    it('should return prosecuting authority', async () => {
        const data: Map<string, object[]> = await opaPressListService.manipulateData(input);
        const cases = data.get(pleaDate);
        expect(cases[0]['prosecutor']).is.equal('Prosecuting authority ref');
    });

    it('should format scheduled hearing date', async () => {
        const data: Map<string, object[]> = await opaPressListService.manipulateData(input);
        const cases = data.get(pleaDate);
        expect(cases[0]['scheduledHearingDate']).is.equal('01/10/2023');
    });

    it('should return case URN', async () => {
        const data: Map<string, object[]> = await opaPressListService.manipulateData(input);
        const cases = data.get(pleaDate);
        expect(cases[0]['urn']).is.equal('URN8888');
    });

    it('should return case reporting restriction', async () => {
        const data: Map<string, object[]> = await opaPressListService.manipulateData(input);
        const cases = data.get(pleaDate);
        expect(cases[0]['caseReportingRestriction']).is.equal(
            'Case reporting Restriction detail line 1, Case reporting restriction detail line 2'
        );
    });

    it('should return offence info', async () => {
        const data: Map<string, object[]> = await opaPressListService.manipulateData(input);
        const cases = data.get(pleaDate);

        expect(cases[0]['offence'].length).to.equal(1);
        const offence = cases[0]['offence'][0];

        expect(offence['offenceTitle']).is.equal('Offence title 2');
        expect(offence['offenceSection']).is.equal('Offence section 2');
        expect(offence['offenceWording']).is.equal('Offence wording 2');
        expect(offence['plea']).is.equal('NOT_GUILTY');
        expect(offence['pleaDate']).is.equal('22/09/2023');
        expect(offence['offenceReportingRestriction']).is.equal('Offence reporting restriction detail 1');
    });

    it('should return multiple offences for a case', async () => {
        const data: Map<string, object[]> = await opaPressListService.manipulateData(input);
        const cases = data.get(pleaDate2);

        expect(cases[0]['offence'].length).to.equal(2);
        const offence1 = cases[0]['offence'][0];
        const offence2 = cases[0]['offence'][1];

        expect(offence1['offenceTitle']).is.equal('Offence title 3');
        expect(offence1['offenceSection']).is.equal('Offence section 3');
        expect(offence1['offenceWording']).is.equal('Offence wording 3');
        expect(offence2['offenceTitle']).is.equal('Offence title 4');
        expect(offence2['offenceSection']).is.equal('Offence section 4');
        expect(offence2['offenceWording']).is.equal('Offence wording 4');
    });
});
