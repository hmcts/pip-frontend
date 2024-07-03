import { expect } from 'chai';
import { SjpPressListService } from '../../../../main/service/listManipulation/SjpPressListService';
import fs from 'fs';
import path from 'path';
import { SjpModel } from '../../../../main/models/style-guide/sjp-model';

const rawSJPData = fs.readFileSync(path.resolve(__dirname, '../../mocks/sjp/extendedSjpPressList.json'), 'utf-8');
const sjpPressListService = new SjpPressListService();

describe('formatSJPPressList', () => {
    it('should return SJP Press List cases', async () => {
        const sjpModel = new SjpModel();
        sjpPressListService.formatSJPPressList(JSON.parse(rawSJPData), sjpModel);
        expect(sjpModel.getFilteredCasesForPage().length).to.equal(5);
    });

    it('should return accused name (individual details) if accused role is first party', async () => {
        const sjpModel = new SjpModel();
        sjpPressListService.formatSJPPressList(JSON.parse(rawSJPData), sjpModel);
        expect(sjpModel.getFilteredCasesForPage()[0]['name']).to.equal('Test Name');
    });

    it('should return accused name (individual details) if accused role is second party', async () => {
        const sjpModel = new SjpModel();
        sjpPressListService.formatSJPPressList(JSON.parse(rawSJPData), sjpModel);
        expect(sjpModel.getFilteredCasesForPage()[1]['name']).to.equal('Test Name 2');
    });

    it('should return accused name (individual details) if surname field missing', async () => {
        const sjpModel = new SjpModel();
        sjpPressListService.formatSJPPressList(JSON.parse(rawSJPData), sjpModel);
        expect(sjpModel.getFilteredCasesForPage()[2]['name']).to.equal('Test');
    });

    it('should return accused name using organisation details', async () => {
        const sjpModel = new SjpModel();
        sjpPressListService.formatSJPPressList(JSON.parse(rawSJPData), sjpModel);
        expect(sjpModel.getFilteredCasesForPage()[3]['name']).to.equal('Organisation Name');
    });

    it('should return formatted date of birth', async () => {
        const sjpModel = new SjpModel();
        sjpPressListService.formatSJPPressList(JSON.parse(rawSJPData), sjpModel);
        expect(sjpModel.getFilteredCasesForPage()[0]['dob']).to.equal('1 January 1801');
    });

    it('should return empty date of birth if missing', async () => {
        const sjpModel = new SjpModel();
        sjpPressListService.formatSJPPressList(JSON.parse(rawSJPData), sjpModel);
        expect(sjpModel.getFilteredCasesForPage()[1]['dob']).to.be.empty;
    });

    it('should return age', async () => {
        const sjpModel = new SjpModel();
        sjpPressListService.formatSJPPressList(JSON.parse(rawSJPData), sjpModel);
        expect(sjpModel.getFilteredCasesForPage()[0]['age']).to.equal(200);
    });

    it('should return age value of zero if missing', async () => {
        const sjpModel = new SjpModel();
        sjpPressListService.formatSJPPressList(JSON.parse(rawSJPData), sjpModel);
        expect(sjpModel.getFilteredCasesForPage()[1]['age']).to.equal(0);
    });

    it('should return case URN', async () => {
        const sjpModel = new SjpModel();
        sjpPressListService.formatSJPPressList(JSON.parse(rawSJPData), sjpModel);
        expect(sjpModel.getFilteredCasesForPage()[0]['caseUrn']).to.equal('Case URN');
    });

    it('should return formatted address and postcode (with individual details)', async () => {
        const sjpModel = new SjpModel();
        sjpPressListService.formatSJPPressList(JSON.parse(rawSJPData), sjpModel);
        expect(sjpModel.getFilteredCasesForPage()[0]['address']).to.equal(
            'Line 1 Line 2, Test Town, Test County, AA1 1AA'
        );
        expect(sjpModel.getFilteredCasesForPage()[0]['postcode']).to.equal('AA1 1AA');
    });

    it('should return formatted address and postcode (with organisation details)', async () => {
        const sjpModel = new SjpModel();
        sjpPressListService.formatSJPPressList(JSON.parse(rawSJPData), sjpModel);
        expect(sjpModel.getFilteredCasesForPage()[3]['address']).to.equal(
            'Line 1 Line 2, Test Town, Test County, AA1 1AA'
        );
        expect(sjpModel.getFilteredCasesForPage()[3]['postcode']).to.equal('AA1 1AA');
    });

    it('should return nothing for formatted address and postcode if address field is missing', async () => {
        const sjpModel = new SjpModel();
        sjpPressListService.formatSJPPressList(JSON.parse(rawSJPData), sjpModel);
        expect(sjpModel.getFilteredCasesForPage()[2]['address']).to.equal('');
        expect(sjpModel.getFilteredCasesForPage()[2]['postcode']).to.equal('');
    });

    it('should return nothing for formatted address and postcode if address field is empty', async () => {
        const sjpModel = new SjpModel();
        sjpPressListService.formatSJPPressList(JSON.parse(rawSJPData), sjpModel);
        expect(sjpModel.getFilteredCasesForPage()[4]['address']).to.equal('');
        expect(sjpModel.getFilteredCasesForPage()[4]['postcode']).to.equal('');
    });

    it('should return prosecutor if prosecutor role is first party', async () => {
        const sjpModel = new SjpModel();
        sjpPressListService.formatSJPPressList(JSON.parse(rawSJPData), sjpModel);
        expect(sjpModel.getFilteredCasesForPage()[0]['prosecutorName']).to.equal('Organisation Name');
    });

    it('should return prosecutor if prosecutor role is second party', async () => {
        const sjpModel = new SjpModel();
        sjpPressListService.formatSJPPressList(JSON.parse(rawSJPData), sjpModel);
        expect(sjpModel.getFilteredCasesForPage()[1]['prosecutorName']).to.equal('Organisation Name');
    });

    it('should return offences', async () => {
        const sjpModel = new SjpModel();
        sjpPressListService.formatSJPPressList(JSON.parse(rawSJPData), sjpModel);

        const offences = sjpModel.getFilteredCasesForPage()[0]['offences'];

        expect(offences[0].reportingRestrictionFlag).to.equal('True');
        expect(offences[0].offenceTitle).to.equal('This is an offence title');
        expect(offences[0].offenceWording).to.equal('This is offence wording');

        expect(offences[1].reportingRestrictionFlag).to.equal('True');
        expect(offences[1].offenceTitle).to.equal('Another offence title');
        expect(offences[1].offenceWording).to.equal('');
    });

    it('should remove filtered out cases for postcode', async () => {
        const sjpModel = new SjpModel();
        sjpModel.setCurrentFilterValues(['AA5']);
        sjpPressListService.formatSJPPressList(JSON.parse(rawSJPData), sjpModel);
        expect(sjpModel.getFilteredCasesForPage().length).to.equal(1);
    });

    it('should remove filtered out cases for prosecutor', async () => {
        const sjpModel = new SjpModel();
        sjpModel.setCurrentFilterValues(['OrganisationName5']);
        sjpPressListService.formatSJPPressList(JSON.parse(rawSJPData), sjpModel);
        expect(sjpModel.getFilteredCasesForPage().length).to.equal(1);
    });

    it('should only include correct number of cases', async () => {
        const sjpModel = new SjpModel();

        const rawData = JSON.parse(rawSJPData);
        const courtLists = rawData['courtLists'] as object[];
        const courtList = courtLists[0];
        for (let i = 0; i < 999; i++) {
            courtLists.push(courtList);
        }

        sjpPressListService.formatSJPPressList(JSON.parse(JSON.stringify({ courtLists: courtLists })), sjpModel);
        expect(sjpModel.getFilteredCasesForPage().length).to.equal(1000);
        expect(sjpModel.getTotalNumberOfCases()).to.equal(5000);
    });

    it('should contain the right postcodes in the filter list', async () => {
        const sjpModel = new SjpModel();
        sjpModel.setCurrentFilterValues(['AA1']);
        sjpPressListService.formatSJPPressList(JSON.parse(rawSJPData), sjpModel);
        expect(sjpModel.getPostcodes().size).to.equal(2);
        expect(sjpModel.getPostcodes()).contains('AA1');
        expect(sjpModel.getPostcodes()).contains('AA5');
    });

    it('should contain the right prosecutors in the filter list', async () => {
        const sjpModel = new SjpModel();
        sjpModel.setCurrentFilterValues(['OrganisationName5']);
        sjpPressListService.formatSJPPressList(JSON.parse(rawSJPData), sjpModel);
        expect(sjpModel.getProsecutors().size).to.equal(2);
        expect(sjpModel.getProsecutors()).contains('Organisation Name');
        expect(sjpModel.getProsecutors()).contains('Organisation Name 5');
    });
});
