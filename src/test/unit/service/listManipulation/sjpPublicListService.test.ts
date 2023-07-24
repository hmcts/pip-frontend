import { expect } from 'chai';
import { SjpPublicListService } from '../../../../main/service/listManipulation/SjpPublicListService';
import fs from 'fs';
import path from 'path';

const rawSJPData = fs.readFileSync(path.resolve(__dirname, '../../mocks/SJPMockPage.json'), 'utf-8');
const sjpPublicListService = new SjpPublicListService();

describe('formatSjpPublicList', () => {
    it('should return SJP Public List cases', async () => {
        const data = await sjpPublicListService.formatSjpPublicList(rawSJPData);
        expect(data.length).to.equal(3);
    });

    it('should return accused name', async () => {
        const data = await sjpPublicListService.formatSjpPublicList(rawSJPData);
        expect(data[0].name).to.equal('Test Name');
    });

    it('should return accused postcode', async () => {
        const data = await sjpPublicListService.formatSjpPublicList(rawSJPData);
        expect(data[0].postcode).to.equal('TEST POSTCODE');
    });

    it('should return prosecutor', async () => {
        const data = await sjpPublicListService.formatSjpPublicList(rawSJPData);
        expect(data[0].prosecutorName).to.equal('Organisation Name');
    });

    it('should return single offence', async () => {
        const data = await sjpPublicListService.formatSjpPublicList(rawSJPData);
        expect(data[0].offence).to.equal('This is an offence title');
    });

    it('should return combined offences', async () => {
        const data = await sjpPublicListService.formatSjpPublicList(rawSJPData);
        expect(data[1].offence).to.equal('This is an offence title, Another offence title');
    });
});
