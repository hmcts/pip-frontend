import { expect } from 'chai';
import { SjpPublicListService } from '../../../../main/service/listManipulation/SjpPublicListService';
import fs from 'fs';
import path from 'path';
import { SjpModel } from '../../../../main/models/style-guide/sjp-model';

const rawSJPData = fs.readFileSync(path.resolve(__dirname, '../../mocks/sjp/minimalSjpPublicList.json'), 'utf-8');
const sjpPublicListService = new SjpPublicListService();

describe('formatSjpPublicList', () => {
    it('should return SJP Public List cases', async () => {
        const sjpModel = new SjpModel();
        sjpPublicListService.formatSjpPublicList(JSON.parse(rawSJPData), sjpModel);
        expect(sjpModel.getFilteredCasesForPage().length).to.equal(2);
    });

    it('should return accused name using individual details', async () => {
        const sjpModel = new SjpModel();
        sjpPublicListService.formatSjpPublicList(JSON.parse(rawSJPData), sjpModel);
        expect(sjpModel.getFilteredCasesForPage()[0]['name']).to.equal('A This is a surname');
    });

    it('should return accused name using organisation details', async () => {
        const sjpModel = new SjpModel();
        sjpPublicListService.formatSjpPublicList(JSON.parse(rawSJPData), sjpModel);
        expect(sjpModel.getFilteredCasesForPage()[1]['name']).to.equal('This is an accused organisation name');
    });

    it('should return accused postcode using individual details', async () => {
        const sjpModel = new SjpModel();
        sjpPublicListService.formatSjpPublicList(JSON.parse(rawSJPData), sjpModel);
        expect(sjpModel.getFilteredCasesForPage()[0]['postcode']).to.equal('AA');
    });

    it('should return accused postcode using organisation details', async () => {
        const sjpModel = new SjpModel();
        sjpPublicListService.formatSjpPublicList(JSON.parse(rawSJPData), sjpModel);
        expect(sjpModel.getFilteredCasesForPage()[1]['postcode']).to.equal('A9');
    });

    it('should return prosecutor', async () => {
        const sjpModel = new SjpModel();
        sjpPublicListService.formatSjpPublicList(JSON.parse(rawSJPData), sjpModel);
        expect(sjpModel.getFilteredCasesForPage()[0]['prosecutorName']).to.equal('This is a prosecutor organisation');
    });

    it('should return single offence', async () => {
        const sjpModel = new SjpModel();
        sjpPublicListService.formatSjpPublicList(JSON.parse(rawSJPData), sjpModel);
        expect(sjpModel.getFilteredCasesForPage()[0]['offence']).to.equal('This is an offence title');
    });

    it('should return combined offences', async () => {
        const sjpModel = new SjpModel();
        sjpPublicListService.formatSjpPublicList(JSON.parse(rawSJPData), sjpModel);
        expect(sjpModel.getFilteredCasesForPage()[1]['offence']).to.equal(
            'This is an offence title, Another offence title'
        );
    });

    it('should remove filtered out cases for postcode', async () => {
        const sjpModel = new SjpModel();
        sjpModel.setCurrentFilterValues(['AA']);
        sjpPublicListService.formatSjpPublicList(JSON.parse(rawSJPData), sjpModel);
        expect(sjpModel.getFilteredCasesForPage().length).to.equal(1);
    });

    it('should remove filtered out cases for prosecutor', async () => {
        const sjpModel = new SjpModel();
        sjpModel.setCurrentFilterValues(['Thisisaprosecutororganisation2']);
        sjpPublicListService.formatSjpPublicList(JSON.parse(rawSJPData), sjpModel);
        expect(sjpModel.getFilteredCasesForPage().length).to.equal(1);
    });

    it('should remove filtered out cases matching both types of filters when both postcode and prosecutor filters present', async () => {
        const sjpModel = new SjpModel();
        sjpModel.setCurrentFilterValues(['AA', 'Thisisaprosecutororganisation']);
        sjpPublicListService.formatSjpPublicList(JSON.parse(rawSJPData), sjpModel);
        expect(sjpModel.getFilteredCasesForPage().length).to.equal(1);
    });

    it('should not filter out cases if not matching both types of filters when both postcode and prosecutor filters present', async () => {
        const sjpModel = new SjpModel();
        sjpModel.setCurrentFilterValues(['A9', 'Thisisaprosecutororganisation']);
        sjpPublicListService.formatSjpPublicList(JSON.parse(rawSJPData), sjpModel);
        expect(sjpModel.getFilteredCasesForPage()).to.be.empty;
    });

    it('should only include correct number of cases', async () => {
        const sjpModel = new SjpModel();

        const rawData = JSON.parse(rawSJPData);
        const courtLists = rawData['courtLists'] as object[];
        const courtList = courtLists[0];
        for (let i = 0; i < 999; i++) {
            courtLists.push(courtList);
        }

        sjpPublicListService.formatSjpPublicList(JSON.parse(JSON.stringify({ courtLists: courtLists })), sjpModel);
        expect(sjpModel.getFilteredCasesForPage().length).to.equal(1000);
        expect(sjpModel.getTotalNumberOfCases()).to.equal(2000);
    });

    it('should contain the right postcodes in the filter list', async () => {
        const sjpModel = new SjpModel();
        sjpModel.setCurrentFilterValues(['AA']);
        sjpPublicListService.formatSjpPublicList(JSON.parse(rawSJPData), sjpModel);
        expect(sjpModel.getPostcodes().size).to.equal(2);
        expect(sjpModel.getPostcodes()).contains('AA');
        expect(sjpModel.getPostcodes()).contains('A9');
    });

    it('should contain the right prosecutors in the filter list', async () => {
        const sjpModel = new SjpModel();
        sjpModel.setCurrentFilterValues(['Thisisaprosecutororganisation2']);
        sjpPublicListService.formatSjpPublicList(JSON.parse(rawSJPData), sjpModel);
        expect(sjpModel.getProsecutors().size).to.equal(2);
        expect(sjpModel.getProsecutors()).contains('This is a prosecutor organisation');
        expect(sjpModel.getProsecutors()).contains('This is a prosecutor organisation 2');
    });
});
