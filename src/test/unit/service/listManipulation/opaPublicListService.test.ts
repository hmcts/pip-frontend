import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import { OpaPublicListService } from '../../../../main/service/listManipulation/OpaPublicListService';

const opaPublicListService = new OpaPublicListService();

describe('OPA Public List Service', () => {
    const rawData = fs.readFileSync(path.resolve(__dirname, '../../mocks/opaPublicList.json'), 'utf-8');
    const input = JSON.stringify(JSON.parse(rawData));

    it('should format individual defendant name', async () => {
        const data = await opaPublicListService.formatOpaPublicList(input);
        expect(data[0]['name']).is.equal('individualFirstName individualMiddleName IndividualSurname');
    });

    it('should format organisation defendant name', async () => {
        const data = await opaPublicListService.formatOpaPublicList(input);
        expect(data[6]['name']).is.equal('defendantOrganisationName');
    });

    it('should return URN', async () => {
        const data = await opaPublicListService.formatOpaPublicList(input);
        expect(data[0]['caseUrn']).is.equal('URN1234');
    });

    it('should return offence', async () => {
        const data: Map<string, object[]> = await opaPublicListService.formatOpaPublicList(input);
        expect(data[0]['offence'].length).to.equal(1);
        const offence = data[0]['offence'][0];

        expect(offence['offenceTitle']).is.equal('Offence title');
        expect(offence['offenceSection']).is.equal('Offence section');
        expect(offence['offenceReportingRestriction']).is.equal('Offence Reporting Restriction detail');
    });

    it('should return prosecuting authority informant', async () => {
        const data = await opaPublicListService.formatOpaPublicList(input);
        expect(data[2]['prosecutor']).is.equal('Prosecution Authority ref 1');
    });

    it('should return formatted scheduled hearing date', async () => {
        const data = await opaPublicListService.formatOpaPublicList(input);
        expect(data[0]['scheduledHearingDate']).is.equal('14/09/16');
    });

    it('should return case reporting restriction', async () => {
        const data: Map<string, object[]> = await opaPublicListService.formatOpaPublicList(input);
        expect(data[0]['caseReportingRestriction']).is.equal(
            'Case Reporting Restriction detail line 1, Case Reporting restriction detail line 2'
        );
    });
});
