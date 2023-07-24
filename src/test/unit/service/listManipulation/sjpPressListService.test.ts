import { expect } from 'chai';
import { SjpPressListService } from '../../../../main/service/listManipulation/SjpPressListService';
import fs from 'fs';
import path from 'path';

const rawSJPData = fs.readFileSync(path.resolve(__dirname, '../../mocks/SJPMockPage.json'), 'utf-8');
const sjpPressListService = new SjpPressListService();

describe('formatSJPPressList', () => {
    it('should return SJP Press List cases', async () => {
        const data = await sjpPressListService.formatSJPPressList(rawSJPData);
        expect(data.length).to.equal(3);
    });

    it('should return accused name if accused role is first party', async () => {
        const data = await sjpPressListService.formatSJPPressList(rawSJPData);
        expect(data[0].name).to.equal('Test Name');
    });

    it('should return accused name if accused role is second party', async () => {
        const data = await sjpPressListService.formatSJPPressList(rawSJPData);
        expect(data[2].name).to.equal('Mr Test M Name');
    });

    it('should return formatted date of birth', async () => {
        const data = await sjpPressListService.formatSJPPressList(rawSJPData);
        expect(data[0].dob).to.equal('1 January 1801');
    });

    it('should return age', async () => {
        const data = await sjpPressListService.formatSJPPressList(rawSJPData);
        expect(data[0].age).to.equal(200);
    });

    it('should return case URN', async () => {
        const data = await sjpPressListService.formatSJPPressList(rawSJPData);
        expect(data[0].caseUrn).to.equal('Case URN');
    });

    it('should return formatted address and postcode', async () => {
        const data = await sjpPressListService.formatSJPPressList(rawSJPData);
        expect(data[0].address).to.equal('Line 1 Line 2, Test Town, Test County, TEST POSTCODE');
        expect(data[0].postcode).to.equal('TEST POSTCODE');
    });

    it('should return prosecutor if prosecutor role is first party', async () => {
        const data = await sjpPressListService.formatSJPPressList(rawSJPData);
        expect(data[0].organisationName).to.equal('Organisation Name');
    });

    it('should return prosecutor if prosecutor role is second party', async () => {
        const data = await sjpPressListService.formatSJPPressList(rawSJPData);
        expect(data[2].organisationName).to.equal('Organisation Name');
    });

    it('should return offences', async () => {
        const data = await sjpPressListService.formatSJPPressList(rawSJPData);
        const offences = data[0].offences;

        expect(offences).to.have.length(1);
        expect(offences[0].reportingRestrictionFlag).to.equal('True');
        expect(offences[0].offenceTitle).to.equal('This is an offence title');
        expect(offences[0].offenceWording).to.equal('This is offence wording');
    });
});
