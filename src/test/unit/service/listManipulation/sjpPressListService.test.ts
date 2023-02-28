import { expect } from 'chai';
import { SjpPressListService } from '../../../../main/service/listManipulation/SjpPressListService';
import fs from 'fs';
import path from 'path';

const rawSJPData = fs.readFileSync(path.resolve(__dirname, '../../mocks/SJPMockPage.json'), 'utf-8');
const sjpPressListService = new SjpPressListService();

describe('formatSJPPressList', () => {
    it('should return SJP Press List cases', async () => {
        const data = await sjpPressListService.formatSJPPressList(rawSJPData);
        expect(data.length).to.equal(2);
    });

    it('should return accused name', async () => {
        const data = await sjpPressListService.formatSJPPressList(rawSJPData);
        expect(data[0].name).to.equal('Danny Thomas');
    });

    it('should return formatted date of birth', async () => {
        const data = await sjpPressListService.formatSJPPressList(rawSJPData);
        expect(data[0].dob).to.equal('25 July 1985');
    });

    it('should return age', async () => {
        const data = await sjpPressListService.formatSJPPressList(rawSJPData);
        expect(data[0].age).to.equal('37');
    });

    it('should return case URN', async () => {
        const data = await sjpPressListService.formatSJPPressList(rawSJPData);
        expect(data[0].caseUrn).to.equal('ABC12345');
    });

    it('should return formatted address and postcode', async () => {
        const data = await sjpPressListService.formatSJPPressList(rawSJPData);
        expect(data[0].address).to.equal('Swansea, SA1 1AA');
        expect(data[0].postcode).to.equal('SA1 1AA');
    });

    it('should return prosecutor', async () => {
        const data = await sjpPressListService.formatSJPPressList(rawSJPData);
        expect(data[0].organisationName).to.equal('qU8QlEo');
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
