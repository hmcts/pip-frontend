import { SjpFilterService } from '../../../main/service/sjpFilterService';
import { expect } from 'chai';

const filterService = new SjpFilterService();

const allCases = [
    {
        name: 'Test name 1',
        postcode: 'SW1 1AA',
        prosecutorName: 'Org name 1',
    },
    {
        name: 'Test name 2',
        postcode: 'SW1H 9AJ',
        prosecutorName: 'Org name,3',
    },
    {
        name: 'Test name 3',
        postcode: 'SW1H 9AA',
        prosecutorName: 'Org name,3',
    },
    {
        name: 'Test name 4',
        postcode: 'SW1H 9AJ',
        prosecutorName: 'Org name 2',
    },
    {
        name: 'Test name 5',
        postcode: 'SW11 2AA',
        prosecutorName: 'Org name 2',
    },
    {
        name: 'Test name 6',
        postcode: 'NW99 8LO',
        prosecutorName: 'Org name 4',
    },
    {
        name: 'Test name 7',
        postcode: 'EC99 7LO',
        prosecutorName: 'Org name 4',
    },
    {
        name: 'Test name 8',
        postcode: 'NP99 9NL',
        prosecutorName: 'Org name 4',
    },
    {
        name: 'Test name 9',
        postcode: 'WA78 0NL',
        prosecutorName: 'Org name 5',
    },
    {
        name: 'Test name 10',
        postcode: '',
        prosecutorName: 'Org name 5',
    },
];

describe('SJP filter service', () => {
    it('should return all SJP cases when no filtering', async () => {
        const result = filterService.generateFilters(allCases, null, null);
        expect(result.sjpCases).to.have.length(10);

        const postcodes = result.filterOptions.postcodes;
        expect(postcodes).to.have.length(8);
        expect(postcodes[0]).to.contain({ value: 'EC99', text: 'EC99', checked: false });
        expect(postcodes[1]).to.contain({ value: 'NP99', text: 'NP99', checked: false });
        expect(postcodes[2]).to.contain({ value: 'NW99', text: 'NW99', checked: false });
        expect(postcodes[3]).to.contain({ value: 'SW1', text: 'SW1', checked: false });
        expect(postcodes[4]).to.contain({ value: 'SW1H', text: 'SW1H', checked: false });
        expect(postcodes[5]).to.contain({ value: 'SW11', text: 'SW11', checked: false });
        expect(postcodes[6]).to.contain({ value: 'WA78', text: 'WA78', checked: false });
        expect(postcodes[7]).to.contain({ value: 'London Postcodes', text: 'London Postcodes', checked: false });

        const prosecutors = result.filterOptions.prosecutors;
        expect(prosecutors).to.have.length(5);
        expect(prosecutors[0]).to.contain({ value: 'Orgname1', text: 'Org name 1', checked: false });
        expect(prosecutors[1]).to.contain({ value: 'Orgname2', text: 'Org name 2', checked: false });
        expect(prosecutors[2]).to.contain({ value: 'Orgname4', text: 'Org name 4', checked: false });
        expect(prosecutors[3]).to.contain({ value: 'Orgname5', text: 'Org name 5', checked: false });
        expect(prosecutors[4]).to.contain({ value: 'Orgname3', text: 'Org name,3', checked: false });
    });

    it('should return all SJP cases when clearing all filters', async () => {
        const result = filterService.generateFilters(allCases, undefined, 'all');
        expect(result.sjpCases).to.have.length(10);

        const postcodes = result.filterOptions.postcodes;
        expect(postcodes).to.have.length(8);
        expect(postcodes[0]).to.contain({ value: 'EC99', text: 'EC99', checked: false });
        expect(postcodes[1]).to.contain({ value: 'NP99', text: 'NP99', checked: false });
        expect(postcodes[2]).to.contain({ value: 'NW99', text: 'NW99', checked: false });
        expect(postcodes[3]).to.contain({ value: 'SW1', text: 'SW1', checked: false });
        expect(postcodes[4]).to.contain({ value: 'SW1H', text: 'SW1H', checked: false });
        expect(postcodes[5]).to.contain({ value: 'SW11', text: 'SW11', checked: false });
        expect(postcodes[6]).to.contain({ value: 'WA78', text: 'WA78', checked: false });
        expect(postcodes[7]).to.contain({ value: 'London Postcodes', text: 'London Postcodes', checked: false });

        const prosecutors = result.filterOptions.prosecutors;
        expect(prosecutors).to.have.length(5);
        expect(prosecutors[0]).to.contain({ value: 'Orgname1', text: 'Org name 1', checked: false });
        expect(prosecutors[1]).to.contain({ value: 'Orgname2', text: 'Org name 2', checked: false });
        expect(prosecutors[2]).to.contain({ value: 'Orgname4', text: 'Org name 4', checked: false });
        expect(prosecutors[3]).to.contain({ value: 'Orgname5', text: 'Org name 5', checked: false });
        expect(prosecutors[4]).to.contain({ value: 'Orgname3', text: 'Org name,3', checked: false });
    });

    it('should return filtered SJP cases when clearing a postcode filter', async () => {
        const result = filterService.generateFilters(allCases, ',Orgname2', 'SW1H');
        expect(result.sjpCases).to.have.length(2);

        const postcodes = result.filterOptions.postcodes;
        expect(postcodes).to.have.length(8);
        expect(postcodes[0]).to.contain({ value: 'EC99', text: 'EC99', checked: false });
        expect(postcodes[1]).to.contain({ value: 'NP99', text: 'NP99', checked: false });
        expect(postcodes[2]).to.contain({ value: 'NW99', text: 'NW99', checked: false });
        expect(postcodes[3]).to.contain({ value: 'SW1', text: 'SW1', checked: false });
        expect(postcodes[4]).to.contain({ value: 'SW1H', text: 'SW1H', checked: false });
        expect(postcodes[5]).to.contain({ value: 'SW11', text: 'SW11', checked: false });
        expect(postcodes[6]).to.contain({ value: 'WA78', text: 'WA78', checked: false });
        expect(postcodes[7]).to.contain({ value: 'London Postcodes', text: 'London Postcodes', checked: false });

        const prosecutors = result.filterOptions.prosecutors;
        expect(prosecutors).to.have.length(5);
        expect(prosecutors[0]).to.contain({ value: 'Orgname1', text: 'Org name 1', checked: false });
        expect(prosecutors[1]).to.contain({ value: 'Orgname2', text: 'Org name 2', checked: true });
        expect(prosecutors[2]).to.contain({ value: 'Orgname4', text: 'Org name 4', checked: false });
        expect(prosecutors[3]).to.contain({ value: 'Orgname5', text: 'Org name 5', checked: false });
        expect(prosecutors[4]).to.contain({ value: 'Orgname3', text: 'Org name,3', checked: false });
    });

    it('should return filtered SJP cases when clearing a prosecutor filter', async () => {
        const result = filterService.generateFilters(allCases, 'WA78', 'Orgname3');
        expect(result.sjpCases).to.have.length(1);

        const postcodes = result.filterOptions.postcodes;
        expect(postcodes).to.have.length(8);
        expect(postcodes[0]).to.contain({ value: 'EC99', text: 'EC99', checked: false });
        expect(postcodes[1]).to.contain({ value: 'NP99', text: 'NP99', checked: false });
        expect(postcodes[2]).to.contain({ value: 'NW99', text: 'NW99', checked: false });
        expect(postcodes[3]).to.contain({ value: 'SW1', text: 'SW1', checked: false });
        expect(postcodes[4]).to.contain({ value: 'SW1H', text: 'SW1H', checked: false });
        expect(postcodes[5]).to.contain({ value: 'SW11', text: 'SW11', checked: false });
        expect(postcodes[6]).to.contain({ value: 'WA78', text: 'WA78', checked: true });
        expect(postcodes[7]).to.contain({ value: 'London Postcodes', text: 'London Postcodes', checked: false });

        const prosecutors = result.filterOptions.prosecutors;
        expect(prosecutors).to.have.length(5);
        expect(prosecutors[0]).to.contain({ value: 'Orgname1', text: 'Org name 1', checked: false });
        expect(prosecutors[1]).to.contain({ value: 'Orgname2', text: 'Org name 2', checked: false });
        expect(prosecutors[2]).to.contain({ value: 'Orgname4', text: 'Org name 4', checked: false });
        expect(prosecutors[3]).to.contain({ value: 'Orgname5', text: 'Org name 5', checked: false });
        expect(prosecutors[4]).to.contain({ value: 'Orgname3', text: 'Org name,3', checked: false });
    });

    it('should return filtered SJP cases when applying a single postcode filter', async () => {
        const result = filterService.generateFilters(allCases, 'SW1H', undefined);
        expect(result.sjpCases).to.have.length(3);

        const postcodes = result.filterOptions.postcodes;
        expect(postcodes).to.have.length(8);
        expect(postcodes[0]).to.contain({ value: 'EC99', text: 'EC99', checked: false });
        expect(postcodes[1]).to.contain({ value: 'NP99', text: 'NP99', checked: false });
        expect(postcodes[2]).to.contain({ value: 'NW99', text: 'NW99', checked: false });
        expect(postcodes[3]).to.contain({ value: 'SW1', text: 'SW1', checked: false });
        expect(postcodes[4]).to.contain({ value: 'SW1H', text: 'SW1H', checked: true });
        expect(postcodes[5]).to.contain({ value: 'SW11', text: 'SW11', checked: false });
        expect(postcodes[6]).to.contain({ value: 'WA78', text: 'WA78', checked: false });
        expect(postcodes[7]).to.contain({ value: 'London Postcodes', text: 'London Postcodes', checked: false });

        const prosecutors = result.filterOptions.prosecutors;
        expect(prosecutors).to.have.length(5);
        expect(prosecutors[0]).to.contain({ value: 'Orgname1', text: 'Org name 1', checked: false });
        expect(prosecutors[1]).to.contain({ value: 'Orgname2', text: 'Org name 2', checked: false });
        expect(prosecutors[2]).to.contain({ value: 'Orgname4', text: 'Org name 4', checked: false });
        expect(prosecutors[3]).to.contain({ value: 'Orgname5', text: 'Org name 5', checked: false });
        expect(prosecutors[4]).to.contain({ value: 'Orgname3', text: 'Org name,3', checked: false });
    });

    it('should return filtered SJP cases using only pre space postcode values when applying a postcode filter', async () => {
        const result = filterService.generateFilters(allCases, 'SW11', undefined);
        expect(result.sjpCases).to.have.length(1);

        const postcodes = result.filterOptions.postcodes;
        expect(postcodes).to.have.length(8);
        expect(postcodes[0]).to.contain({ value: 'EC99', text: 'EC99', checked: false });
        expect(postcodes[1]).to.contain({ value: 'NP99', text: 'NP99', checked: false });
        expect(postcodes[2]).to.contain({ value: 'NW99', text: 'NW99', checked: false });
        expect(postcodes[3]).to.contain({ value: 'SW1', text: 'SW1', checked: false });
        expect(postcodes[4]).to.contain({ value: 'SW1H', text: 'SW1H', checked: false });
        expect(postcodes[5]).to.contain({ value: 'SW11', text: 'SW11', checked: true });
        expect(postcodes[6]).to.contain({ value: 'WA78', text: 'WA78', checked: false });
        expect(postcodes[7]).to.contain({ value: 'London Postcodes', text: 'London Postcodes', checked: false });

        const prosecutors = result.filterOptions.prosecutors;
        expect(prosecutors).to.have.length(5);
        expect(prosecutors[0]).to.contain({ value: 'Orgname1', text: 'Org name 1', checked: false });
        expect(prosecutors[1]).to.contain({ value: 'Orgname2', text: 'Org name 2', checked: false });
        expect(prosecutors[2]).to.contain({ value: 'Orgname4', text: 'Org name 4', checked: false });
        expect(prosecutors[3]).to.contain({ value: 'Orgname5', text: 'Org name 5', checked: false });
        expect(prosecutors[4]).to.contain({ value: 'Orgname3', text: 'Org name,3', checked: false });
    });

    it('should return filtered SJP cases which exactly match the pre space postcode values', async () => {
        const result = filterService.generateFilters(allCases, 'SW1', undefined);
        expect(result.sjpCases).to.have.length(1);

        const postcodes = result.filterOptions.postcodes;
        expect(postcodes).to.have.length(8);
        expect(postcodes[0]).to.contain({ value: 'EC99', text: 'EC99', checked: false });
        expect(postcodes[1]).to.contain({ value: 'NP99', text: 'NP99', checked: false });
        expect(postcodes[2]).to.contain({ value: 'NW99', text: 'NW99', checked: false });
        expect(postcodes[3]).to.contain({ value: 'SW1', text: 'SW1', checked: true });
        expect(postcodes[4]).to.contain({ value: 'SW1H', text: 'SW1H', checked: false });
        expect(postcodes[5]).to.contain({ value: 'SW11', text: 'SW11', checked: false });
        expect(postcodes[6]).to.contain({ value: 'WA78', text: 'WA78', checked: false });
        expect(postcodes[7]).to.contain({ value: 'London Postcodes', text: 'London Postcodes', checked: false });

        const prosecutors = result.filterOptions.prosecutors;
        expect(prosecutors).to.have.length(5);
        expect(prosecutors[0]).to.contain({ value: 'Orgname1', text: 'Org name 1', checked: false });
        expect(prosecutors[1]).to.contain({ value: 'Orgname2', text: 'Org name 2', checked: false });
        expect(prosecutors[2]).to.contain({ value: 'Orgname4', text: 'Org name 4', checked: false });
        expect(prosecutors[3]).to.contain({ value: 'Orgname5', text: 'Org name 5', checked: false });
        expect(prosecutors[4]).to.contain({ value: 'Orgname3', text: 'Org name,3', checked: false });
    });

    it('should return all SJP cases when applying all postcode filters', async () => {
        const result = filterService.generateFilters(
            allCases,
            'SW1,SW1H,SW11,NW99,EC99,NP99,WA78,London Postcodes',
            undefined
        );
        expect(result.sjpCases).to.have.length(9);

        const postcodes = result.filterOptions.postcodes;
        expect(postcodes).to.have.length(8);
        expect(postcodes[0]).to.contain({ value: 'EC99', text: 'EC99', checked: true });
        expect(postcodes[1]).to.contain({ value: 'NP99', text: 'NP99', checked: true });
        expect(postcodes[2]).to.contain({ value: 'NW99', text: 'NW99', checked: true });
        expect(postcodes[3]).to.contain({ value: 'SW1', text: 'SW1', checked: true });
        expect(postcodes[4]).to.contain({ value: 'SW1H', text: 'SW1H', checked: true });
        expect(postcodes[5]).to.contain({ value: 'SW11', text: 'SW11', checked: true });
        expect(postcodes[6]).to.contain({ value: 'WA78', text: 'WA78', checked: true });
        expect(postcodes[7]).to.contain({ value: 'London Postcodes', text: 'London Postcodes', checked: true });

        const prosecutors = result.filterOptions.prosecutors;
        expect(prosecutors).to.have.length(5);
        expect(prosecutors[0]).to.contain({ value: 'Orgname1', text: 'Org name 1', checked: false });
        expect(prosecutors[1]).to.contain({ value: 'Orgname2', text: 'Org name 2', checked: false });
        expect(prosecutors[2]).to.contain({ value: 'Orgname4', text: 'Org name 4', checked: false });
        expect(prosecutors[3]).to.contain({ value: 'Orgname5', text: 'Org name 5', checked: false });
        expect(prosecutors[4]).to.contain({ value: 'Orgname3', text: 'Org name,3', checked: false });
    });

    it('should return filtered SJP cases when applying overlapped postcode filters', async () => {
        const result = filterService.generateFilters(allCases, 'NW99,EC99,London Postcodes', undefined);
        expect(result.sjpCases).to.have.length(7);

        const postcodes = result.filterOptions.postcodes;
        expect(postcodes).to.have.length(8);
        expect(postcodes[0]).to.contain({ value: 'EC99', text: 'EC99', checked: true });
        expect(postcodes[1]).to.contain({ value: 'NP99', text: 'NP99', checked: false });
        expect(postcodes[2]).to.contain({ value: 'NW99', text: 'NW99', checked: true });
        expect(postcodes[3]).to.contain({ value: 'SW1', text: 'SW1', checked: false });
        expect(postcodes[4]).to.contain({ value: 'SW1H', text: 'SW1H', checked: false });
        expect(postcodes[5]).to.contain({ value: 'SW11', text: 'SW11', checked: false });
        expect(postcodes[6]).to.contain({ value: 'WA78', text: 'WA78', checked: false });
        expect(postcodes[7]).to.contain({ value: 'London Postcodes', text: 'London Postcodes', checked: true });

        const prosecutors = result.filterOptions.prosecutors;
        expect(prosecutors).to.have.length(5);
        expect(prosecutors[0]).to.contain({ value: 'Orgname1', text: 'Org name 1', checked: false });
        expect(prosecutors[1]).to.contain({ value: 'Orgname2', text: 'Org name 2', checked: false });
        expect(prosecutors[2]).to.contain({ value: 'Orgname4', text: 'Org name 4', checked: false });
        expect(prosecutors[3]).to.contain({ value: 'Orgname5', text: 'Org name 5', checked: false });
        expect(prosecutors[4]).to.contain({ value: 'Orgname3', text: 'Org name,3', checked: false });
    });

    it('should return all SJP cases when applying all postcode filters except London Postcodes', async () => {
        const result = filterService.generateFilters(allCases, 'SW1,SW1H,SW11,NW99,EC99,NP99,WA78', undefined);
        expect(result.sjpCases).to.have.length(9);

        const postcodes = result.filterOptions.postcodes;
        expect(postcodes).to.have.length(8);
        expect(postcodes[0]).to.contain({ value: 'EC99', text: 'EC99', checked: true });
        expect(postcodes[1]).to.contain({ value: 'NP99', text: 'NP99', checked: true });
        expect(postcodes[2]).to.contain({ value: 'NW99', text: 'NW99', checked: true });
        expect(postcodes[3]).to.contain({ value: 'SW1', text: 'SW1', checked: true });
        expect(postcodes[4]).to.contain({ value: 'SW1H', text: 'SW1H', checked: true });
        expect(postcodes[5]).to.contain({ value: 'SW11', text: 'SW11', checked: true });
        expect(postcodes[6]).to.contain({ value: 'WA78', text: 'WA78', checked: true });
        expect(postcodes[7]).to.contain({ value: 'London Postcodes', text: 'London Postcodes', checked: false });

        const prosecutors = result.filterOptions.prosecutors;
        expect(prosecutors).to.have.length(5);
        expect(prosecutors[0]).to.contain({ value: 'Orgname1', text: 'Org name 1', checked: false });
        expect(prosecutors[1]).to.contain({ value: 'Orgname2', text: 'Org name 2', checked: false });
        expect(prosecutors[2]).to.contain({ value: 'Orgname4', text: 'Org name 4', checked: false });
        expect(prosecutors[3]).to.contain({ value: 'Orgname5', text: 'Org name 5', checked: false });
        expect(prosecutors[4]).to.contain({ value: 'Orgname3', text: 'Org name,3', checked: false });
    });

    it('should return all SJP cases when applying all non London postcode filters and London Postcodes', async () => {
        const result = filterService.generateFilters(allCases, 'NP99,WA78,London Postcodes', undefined);
        expect(result.sjpCases).to.have.length(9);

        const postcodes = result.filterOptions.postcodes;
        expect(postcodes).to.have.length(8);
        expect(postcodes[0]).to.contain({ value: 'EC99', text: 'EC99', checked: false });
        expect(postcodes[1]).to.contain({ value: 'NP99', text: 'NP99', checked: true });
        expect(postcodes[2]).to.contain({ value: 'NW99', text: 'NW99', checked: false });
        expect(postcodes[3]).to.contain({ value: 'SW1', text: 'SW1', checked: false });
        expect(postcodes[4]).to.contain({ value: 'SW1H', text: 'SW1H', checked: false });
        expect(postcodes[5]).to.contain({ value: 'SW11', text: 'SW11', checked: false });
        expect(postcodes[6]).to.contain({ value: 'WA78', text: 'WA78', checked: true });
        expect(postcodes[7]).to.contain({ value: 'London Postcodes', text: 'London Postcodes', checked: true });

        const prosecutors = result.filterOptions.prosecutors;
        expect(prosecutors).to.have.length(5);
        expect(prosecutors[0]).to.contain({ value: 'Orgname1', text: 'Org name 1', checked: false });
        expect(prosecutors[1]).to.contain({ value: 'Orgname2', text: 'Org name 2', checked: false });
        expect(prosecutors[2]).to.contain({ value: 'Orgname4', text: 'Org name 4', checked: false });
        expect(prosecutors[3]).to.contain({ value: 'Orgname5', text: 'Org name 5', checked: false });
        expect(prosecutors[4]).to.contain({ value: 'Orgname3', text: 'Org name,3', checked: false });
    });

    it('should return filtered SJP cases when applying a single prosecutor filter', async () => {
        const result = filterService.generateFilters(allCases, 'Orgname1', undefined);
        expect(result.sjpCases).to.have.length(1);

        const postcodes = result.filterOptions.postcodes;
        expect(postcodes).to.have.length(8);
        expect(postcodes[0]).to.contain({ value: 'EC99', text: 'EC99', checked: false });
        expect(postcodes[1]).to.contain({ value: 'NP99', text: 'NP99', checked: false });
        expect(postcodes[2]).to.contain({ value: 'NW99', text: 'NW99', checked: false });
        expect(postcodes[3]).to.contain({ value: 'SW1', text: 'SW1', checked: false });
        expect(postcodes[4]).to.contain({ value: 'SW1H', text: 'SW1H', checked: false });
        expect(postcodes[5]).to.contain({ value: 'SW11', text: 'SW11', checked: false });
        expect(postcodes[6]).to.contain({ value: 'WA78', text: 'WA78', checked: false });
        expect(postcodes[7]).to.contain({ value: 'London Postcodes', text: 'London Postcodes', checked: false });

        const prosecutors = result.filterOptions.prosecutors;
        expect(prosecutors).to.have.length(5);
        expect(prosecutors[0]).to.contain({ value: 'Orgname1', text: 'Org name 1', checked: true });
        expect(prosecutors[1]).to.contain({ value: 'Orgname2', text: 'Org name 2', checked: false });
        expect(prosecutors[2]).to.contain({ value: 'Orgname4', text: 'Org name 4', checked: false });
        expect(prosecutors[3]).to.contain({ value: 'Orgname5', text: 'Org name 5', checked: false });
        expect(prosecutors[4]).to.contain({ value: 'Orgname3', text: 'Org name,3', checked: false });
    });

    it('should return filtered SJP cases when applying multiple prosecutor filter', async () => {
        const result = filterService.generateFilters(allCases, 'Orgname1,Orgname2', undefined);
        expect(result.sjpCases).to.have.length(3);

        const postcodes = result.filterOptions.postcodes;
        expect(postcodes).to.have.length(8);
        expect(postcodes[0]).to.contain({ value: 'EC99', text: 'EC99', checked: false });
        expect(postcodes[1]).to.contain({ value: 'NP99', text: 'NP99', checked: false });
        expect(postcodes[2]).to.contain({ value: 'NW99', text: 'NW99', checked: false });
        expect(postcodes[3]).to.contain({ value: 'SW1', text: 'SW1', checked: false });
        expect(postcodes[4]).to.contain({ value: 'SW1H', text: 'SW1H', checked: false });
        expect(postcodes[5]).to.contain({ value: 'SW11', text: 'SW11', checked: false });
        expect(postcodes[6]).to.contain({ value: 'WA78', text: 'WA78', checked: false });
        expect(postcodes[7]).to.contain({ value: 'London Postcodes', text: 'London Postcodes', checked: false });

        const prosecutors = result.filterOptions.prosecutors;
        expect(prosecutors).to.have.length(5);
        expect(prosecutors[0]).to.contain({ value: 'Orgname1', text: 'Org name 1', checked: true });
        expect(prosecutors[1]).to.contain({ value: 'Orgname2', text: 'Org name 2', checked: true });
        expect(prosecutors[2]).to.contain({ value: 'Orgname4', text: 'Org name 4', checked: false });
        expect(prosecutors[3]).to.contain({ value: 'Orgname5', text: 'Org name 5', checked: false });
        expect(prosecutors[4]).to.contain({ value: 'Orgname3', text: 'Org name,3', checked: false });
    });

    it('should return all SJP cases when applying all prosecutor filters', async () => {
        const result = filterService.generateFilters(
            allCases,
            'Orgname1,Orgname2,Orgname3,Orgname4,Orgname5',
            undefined
        );
        expect(result.sjpCases).to.have.length(10);

        const postcodes = result.filterOptions.postcodes;
        expect(postcodes).to.have.length(8);
        expect(postcodes[0]).to.contain({ value: 'EC99', text: 'EC99', checked: false });
        expect(postcodes[1]).to.contain({ value: 'NP99', text: 'NP99', checked: false });
        expect(postcodes[2]).to.contain({ value: 'NW99', text: 'NW99', checked: false });
        expect(postcodes[3]).to.contain({ value: 'SW1', text: 'SW1', checked: false });
        expect(postcodes[4]).to.contain({ value: 'SW1H', text: 'SW1H', checked: false });
        expect(postcodes[5]).to.contain({ value: 'SW11', text: 'SW11', checked: false });
        expect(postcodes[6]).to.contain({ value: 'WA78', text: 'WA78', checked: false });
        expect(postcodes[7]).to.contain({ value: 'London Postcodes', text: 'London Postcodes', checked: false });

        const prosecutors = result.filterOptions.prosecutors;
        expect(prosecutors).to.have.length(5);
        expect(prosecutors[0]).to.contain({ value: 'Orgname1', text: 'Org name 1', checked: true });
        expect(prosecutors[1]).to.contain({ value: 'Orgname2', text: 'Org name 2', checked: true });
        expect(prosecutors[2]).to.contain({ value: 'Orgname4', text: 'Org name 4', checked: true });
        expect(prosecutors[3]).to.contain({ value: 'Orgname5', text: 'Org name 5', checked: true });
        expect(prosecutors[4]).to.contain({ value: 'Orgname3', text: 'Org name,3', checked: true });
    });

    it('should return filtered SJP cases when applying overlapped postcode and prosecutor filters', async () => {
        const result = filterService.generateFilters(allCases, 'SW1H,Orgname3', undefined);
        expect(result.sjpCases).to.have.length(2);

        const postcodes = result.filterOptions.postcodes;
        expect(postcodes).to.have.length(8);
        expect(postcodes[0]).to.contain({ value: 'EC99', text: 'EC99', checked: false });
        expect(postcodes[1]).to.contain({ value: 'NP99', text: 'NP99', checked: false });
        expect(postcodes[2]).to.contain({ value: 'NW99', text: 'NW99', checked: false });
        expect(postcodes[3]).to.contain({ value: 'SW1', text: 'SW1', checked: false });
        expect(postcodes[4]).to.contain({ value: 'SW1H', text: 'SW1H', checked: true });
        expect(postcodes[5]).to.contain({ value: 'SW11', text: 'SW11', checked: false });
        expect(postcodes[6]).to.contain({ value: 'WA78', text: 'WA78', checked: false });
        expect(postcodes[7]).to.contain({ value: 'London Postcodes', text: 'London Postcodes', checked: false });

        const prosecutors = result.filterOptions.prosecutors;
        expect(prosecutors).to.have.length(5);
        expect(prosecutors[0]).to.contain({ value: 'Orgname1', text: 'Org name 1', checked: false });
        expect(prosecutors[1]).to.contain({ value: 'Orgname2', text: 'Org name 2', checked: false });
        expect(prosecutors[2]).to.contain({ value: 'Orgname4', text: 'Org name 4', checked: false });
        expect(prosecutors[3]).to.contain({ value: 'Orgname5', text: 'Org name 5', checked: false });
        expect(prosecutors[4]).to.contain({ value: 'Orgname3', text: 'Org name,3', checked: true });
    });

    it('should return no SJP cases when applying non-overlapped postcode and prosecutor filters', async () => {
        const result = filterService.generateFilters(allCases, 'SW1H,Orgname1', undefined);
        expect(result.sjpCases).to.be.empty;

        const postcodes = result.filterOptions.postcodes;
        expect(postcodes).to.have.length(8);
        expect(postcodes[0]).to.contain({ value: 'EC99', text: 'EC99', checked: false });
        expect(postcodes[1]).to.contain({ value: 'NP99', text: 'NP99', checked: false });
        expect(postcodes[2]).to.contain({ value: 'NW99', text: 'NW99', checked: false });
        expect(postcodes[3]).to.contain({ value: 'SW1', text: 'SW1', checked: false });
        expect(postcodes[4]).to.contain({ value: 'SW1H', text: 'SW1H', checked: true });
        expect(postcodes[5]).to.contain({ value: 'SW11', text: 'SW11', checked: false });
        expect(postcodes[6]).to.contain({ value: 'WA78', text: 'WA78', checked: false });
        expect(postcodes[7]).to.contain({ value: 'London Postcodes', text: 'London Postcodes', checked: false });

        const prosecutors = result.filterOptions.prosecutors;
        expect(prosecutors).to.have.length(5);
        expect(prosecutors[0]).to.contain({ value: 'Orgname1', text: 'Org name 1', checked: true });
        expect(prosecutors[1]).to.contain({ value: 'Orgname2', text: 'Org name 2', checked: false });
        expect(prosecutors[2]).to.contain({ value: 'Orgname4', text: 'Org name 4', checked: false });
        expect(prosecutors[3]).to.contain({ value: 'Orgname5', text: 'Org name 5', checked: false });
        expect(prosecutors[4]).to.contain({ value: 'Orgname3', text: 'Org name,3', checked: false });
    });

    it('should return filtered SJP cases where the postal code prefix belongs to London Postcodes', async () => {
        const result = filterService.generateFilters(allCases, 'London Postcodes', undefined);
        expect(result.sjpCases).to.have.length(7);

        const postcodes = result.filterOptions.postcodes;
        expect(postcodes).to.have.length(8);
        expect(postcodes[0]).to.contain({ value: 'EC99', text: 'EC99', checked: false });
        expect(postcodes[1]).to.contain({ value: 'NP99', text: 'NP99', checked: false });
        expect(postcodes[2]).to.contain({ value: 'NW99', text: 'NW99', checked: false });
        expect(postcodes[3]).to.contain({ value: 'SW1', text: 'SW1', checked: false });
        expect(postcodes[4]).to.contain({ value: 'SW1H', text: 'SW1H', checked: false });
        expect(postcodes[5]).to.contain({ value: 'SW11', text: 'SW11', checked: false });
        expect(postcodes[6]).to.contain({ value: 'WA78', text: 'WA78', checked: false });
        expect(postcodes[7]).to.contain({ value: 'London Postcodes', text: 'London Postcodes', checked: true });

        const prosecutors = result.filterOptions.prosecutors;
        expect(prosecutors).to.have.length(5);
        expect(prosecutors[0]).to.contain({ value: 'Orgname1', text: 'Org name 1', checked: false });
        expect(prosecutors[1]).to.contain({ value: 'Orgname2', text: 'Org name 2', checked: false });
        expect(prosecutors[2]).to.contain({ value: 'Orgname4', text: 'Org name 4', checked: false });
        expect(prosecutors[3]).to.contain({ value: 'Orgname5', text: 'Org name 5', checked: false });
        expect(prosecutors[4]).to.contain({ value: 'Orgname3', text: 'Org name,3', checked: false });
    });

    it('should return filtered SJP cases when applying overlapped postcode and prosecutor filters and the postal code prefix belongs to London Postcodes', async () => {
        const result = filterService.generateFilters(allCases, 'London Postcodes,Orgname4', undefined);
        expect(result.sjpCases).to.have.length(2);

        const postcodes = result.filterOptions.postcodes;
        expect(postcodes).to.have.length(8);
        expect(postcodes[0]).to.contain({ value: 'EC99', text: 'EC99', checked: false });
        expect(postcodes[1]).to.contain({ value: 'NP99', text: 'NP99', checked: false });
        expect(postcodes[2]).to.contain({ value: 'NW99', text: 'NW99', checked: false });
        expect(postcodes[3]).to.contain({ value: 'SW1', text: 'SW1', checked: false });
        expect(postcodes[4]).to.contain({ value: 'SW1H', text: 'SW1H', checked: false });
        expect(postcodes[5]).to.contain({ value: 'SW11', text: 'SW11', checked: false });
        expect(postcodes[6]).to.contain({ value: 'WA78', text: 'WA78', checked: false });
        expect(postcodes[7]).to.contain({ value: 'London Postcodes', text: 'London Postcodes', checked: true });

        const prosecutors = result.filterOptions.prosecutors;
        expect(prosecutors).to.have.length(5);
        expect(prosecutors[0]).to.contain({ value: 'Orgname1', text: 'Org name 1', checked: false });
        expect(prosecutors[1]).to.contain({ value: 'Orgname2', text: 'Org name 2', checked: false });
        expect(prosecutors[2]).to.contain({ value: 'Orgname4', text: 'Org name 4', checked: true });
        expect(prosecutors[3]).to.contain({ value: 'Orgname5', text: 'Org name 5', checked: false });
        expect(prosecutors[4]).to.contain({ value: 'Orgname3', text: 'Org name,3', checked: false });
    });

    it('should return no SJP cases when applying non-overlapped postcode and prosecutor filters and the postal code prefix belongs to London Postcodes', async () => {
        const result = filterService.generateFilters(allCases, 'London Postcodes,Orgname5', undefined);
        expect(result.sjpCases).to.be.empty;

        const postcodes = result.filterOptions.postcodes;
        expect(postcodes).to.have.length(8);
        expect(postcodes[0]).to.contain({ value: 'EC99', text: 'EC99', checked: false });
        expect(postcodes[1]).to.contain({ value: 'NP99', text: 'NP99', checked: false });
        expect(postcodes[2]).to.contain({ value: 'NW99', text: 'NW99', checked: false });
        expect(postcodes[3]).to.contain({ value: 'SW1', text: 'SW1', checked: false });
        expect(postcodes[4]).to.contain({ value: 'SW1H', text: 'SW1H', checked: false });
        expect(postcodes[5]).to.contain({ value: 'SW11', text: 'SW11', checked: false });
        expect(postcodes[6]).to.contain({ value: 'WA78', text: 'WA78', checked: false });
        expect(postcodes[7]).to.contain({ value: 'London Postcodes', text: 'London Postcodes', checked: true });

        const prosecutors = result.filterOptions.prosecutors;
        expect(prosecutors).to.have.length(5);
        expect(prosecutors[0]).to.contain({ value: 'Orgname1', text: 'Org name 1', checked: false });
        expect(prosecutors[1]).to.contain({ value: 'Orgname2', text: 'Org name 2', checked: false });
        expect(prosecutors[2]).to.contain({ value: 'Orgname4', text: 'Org name 4', checked: false });
        expect(prosecutors[3]).to.contain({ value: 'Orgname5', text: 'Org name 5', checked: true });
        expect(prosecutors[4]).to.contain({ value: 'Orgname3', text: 'Org name,3', checked: false });
    });
});
