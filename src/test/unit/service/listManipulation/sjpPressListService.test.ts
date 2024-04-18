import { expect } from 'chai';
import { SjpPressListService } from '../../../../main/service/listManipulation/SjpPressListService';
import fs from 'fs';
import path from 'path';

const rawSJPData = fs.readFileSync(path.resolve(__dirname, '../../mocks/sjp-press-list.json'), 'utf-8');
const sjpPressListService = new SjpPressListService();

describe('formatSJPPressList', () => {
    it('should return SJP Press List cases', async () => {
        const data = await sjpPressListService.formatSJPPressList(rawSJPData);
        expect(data.length).to.equal(4);
    });

    it('should return accused name (individual details) if accused role is first party', async () => {
        const data = await sjpPressListService.formatSJPPressList(rawSJPData);
        expect(data[0].name).to.equal('Test Name');
    });

    it('should return accused name (individual details) if accused role is second party', async () => {
        const data = await sjpPressListService.formatSJPPressList(rawSJPData);
        expect(data[2].name).to.equal('Mr M Name');
    });

    it('should return accused name (individual details) if surname field missing', async () => {
        const data = await sjpPressListService.formatSJPPressList(rawSJPData);
        expect(data[3].name).to.equal('Test');
    });

    it('should return accused name using organisation details', async () => {
        const data = await sjpPressListService.formatSJPPressList(rawSJPData);
        expect(data[1].name).to.equal("Accused's org name");
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

    it('should return formatted address and postcode (with individual details)', async () => {
        const data = await sjpPressListService.formatSJPPressList(rawSJPData);
        expect(data[0].address).to.equal('Line 1 Line 2, Test Town, Test County, TEST POSTCODE');
        expect(data[0].postcode).to.equal('TEST POSTCODE');
    });

    it('should return formatted address and postcode (with organisation details)', async () => {
        const data = await sjpPressListService.formatSJPPressList(rawSJPData);
        expect(data[1].address).to.equal('London, London, TEST POSTCODE');
        expect(data[1].postcode).to.equal('TEST POSTCODE');
    });

    it('should return nothing for formatted address and postcode if address field is missing', async () => {
        const data = await sjpPressListService.formatSJPPressList(rawSJPData);
        expect(data[2].address).to.equal('');
        expect(data[2].postcode).to.equal('');
    });

    it('should return nothing for formatted address and postcode if address field is empty', async () => {
        const data = await sjpPressListService.formatSJPPressList(rawSJPData);
        expect(data[2].address).to.equal('');
        expect(data[2].postcode).to.equal('');
    });

    it('should return prosecutor if prosecutor role is first party', async () => {
        const data = await sjpPressListService.formatSJPPressList(rawSJPData);
        expect(data[0].prosecutorName).to.equal('Organisation Name');
    });

    it('should return prosecutor if prosecutor role is second party', async () => {
        const data = await sjpPressListService.formatSJPPressList(rawSJPData);
        expect(data[2].prosecutorName).to.equal('Organisation Name');
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
