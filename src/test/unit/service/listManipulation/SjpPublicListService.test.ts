import { expect } from 'chai';
import { SjpPublicListService } from '../../../../main/service/listManipulation/SjpPublicListService';
import fs from 'fs';
import path from 'path';

const rawSJPData = fs.readFileSync(path.resolve(__dirname, '../../mocks/sjp-public-list.json'), 'utf-8');
const sjpPublicListService = new SjpPublicListService();

describe('formatSjpPublicList', () => {
    it('should return SJP Public List cases', async () => {
        const data = await sjpPublicListService.formatSjpPublicList(rawSJPData);
        expect(data.length).to.equal(2);
    });

    it('should return accused name using individual details', async () => {
        const data = await sjpPublicListService.formatSjpPublicList(rawSJPData);
        expect(data[0].name).to.equal('A This is a surname');
    });

    it('should return accused name using organisation details', async () => {
        const data = await sjpPublicListService.formatSjpPublicList(rawSJPData);
        expect(data[1].name).to.equal('This is an accused organisation name');
    });

    it('should return accused postcode using individual details', async () => {
        const data = await sjpPublicListService.formatSjpPublicList(rawSJPData);
        expect(data[0].postcode).to.equal('AA1');
    });

    it('should return accused postcode using organisation details', async () => {
        const data = await sjpPublicListService.formatSjpPublicList(rawSJPData);
        expect(data[1].postcode).to.equal('A99');
    });

    it('should return prosecutor', async () => {
        const data = await sjpPublicListService.formatSjpPublicList(rawSJPData);
        expect(data[0].prosecutorName).to.equal('This is a prosecutor organisation');
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
