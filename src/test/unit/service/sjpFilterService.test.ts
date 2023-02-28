import { SjpFilterService } from '../../../main/service/sjpFilterService';
import { expect } from 'chai';

const filterService = new SjpFilterService();

const allCases = [
    {
        name: 'Test name 1',
        postcode: 'SW2 1AA',
        organisationName: 'Org name 1',
    },
    {
        name: 'Test name 2',
        postcode: 'SW1 1AA',
        organisationName: 'Org name,3',
    },
    {
        name: 'Test name 3',
        postcode: 'SW1 1AA',
        organisationName: 'Org name,3',
    },
    {
        name: 'Test name 4',
        postcode: 'SW1 1AA',
        organisationName: 'Org name 2',
    },
];

describe('SJP filter service', () => {
    it('should return all SJP cases when no filtering', async () => {
        const result = filterService.generateFilters(allCases, null, null);
        expect(result.sjpCases).to.have.length(4);

        const postcodes = result.filterOptions.postcodes;
        expect(postcodes).to.have.length(2);
        expect(postcodes[0]).to.contain({ value: 'SW11AA', text: 'SW1 1AA', checked: false });
        expect(postcodes[1]).to.contain({ value: 'SW21AA', text: 'SW2 1AA', checked: false });

        const prosecutors = result.filterOptions.prosecutors;
        expect(prosecutors).to.have.length(3);
        expect(prosecutors[0]).to.contain({ value: 'Orgname1', text: 'Org name 1', checked: false });
        expect(prosecutors[1]).to.contain({ value: 'Orgname2', text: 'Org name 2', checked: false });
        expect(prosecutors[2]).to.contain({ value: 'Orgname3', text: 'Org name,3', checked: false });
    });

    it('should return all SJP cases when clearing all filters', async () => {
        const result = filterService.generateFilters(allCases, undefined, 'all');
        expect(result.sjpCases).to.have.length(4);

        const postcodes = result.filterOptions.postcodes;
        expect(postcodes).to.have.length(2);
        expect(postcodes[0]).to.contain({ value: 'SW11AA', text: 'SW1 1AA', checked: false });
        expect(postcodes[1]).to.contain({ value: 'SW21AA', text: 'SW2 1AA', checked: false });

        const prosecutors = result.filterOptions.prosecutors;
        expect(prosecutors).to.have.length(3);
        expect(prosecutors[0]).to.contain({ value: 'Orgname1', text: 'Org name 1', checked: false });
        expect(prosecutors[1]).to.contain({ value: 'Orgname2', text: 'Org name 2', checked: false });
        expect(prosecutors[2]).to.contain({ value: 'Orgname3', text: 'Org name,3', checked: false });
    });

    it('should return filtered SJP cases when clearing a postcode filter', async () => {
        const result = filterService.generateFilters(allCases, ',Orgname2', 'SW21AA');
        expect(result.sjpCases).to.have.length(1);

        const postcodes = result.filterOptions.postcodes;
        expect(postcodes).to.have.length(2);
        expect(postcodes[0]).to.contain({ value: 'SW11AA', text: 'SW1 1AA', checked: false });
        expect(postcodes[1]).to.contain({ value: 'SW21AA', text: 'SW2 1AA', checked: false });

        const prosecutors = result.filterOptions.prosecutors;
        expect(prosecutors).to.have.length(3);
        expect(prosecutors[0]).to.contain({ value: 'Orgname1', text: 'Org name 1', checked: false });
        expect(prosecutors[1]).to.contain({ value: 'Orgname2', text: 'Org name 2', checked: true });
        expect(prosecutors[2]).to.contain({ value: 'Orgname3', text: 'Org name,3', checked: false });
    });

    it('should return filtered SJP cases when clearing a prosecutor filter', async () => {
        const result = filterService.generateFilters(allCases, 'SW11AA,', 'Orgname3');
        expect(result.sjpCases).to.have.length(3);

        const postcodes = result.filterOptions.postcodes;
        expect(postcodes).to.have.length(2);
        expect(postcodes[0]).to.contain({ value: 'SW11AA', text: 'SW1 1AA', checked: true });
        expect(postcodes[1]).to.contain({ value: 'SW21AA', text: 'SW2 1AA', checked: false });

        const prosecutors = result.filterOptions.prosecutors;
        expect(prosecutors).to.have.length(3);
        expect(prosecutors[0]).to.contain({ value: 'Orgname1', text: 'Org name 1', checked: false });
        expect(prosecutors[1]).to.contain({ value: 'Orgname2', text: 'Org name 2', checked: false });
        expect(prosecutors[2]).to.contain({ value: 'Orgname3', text: 'Org name,3', checked: false });
    });

    it('should return filtered SJP cases when applying a single postcode filter', async () => {
        const result = filterService.generateFilters(allCases, 'SW21AA', undefined);
        expect(result.sjpCases).to.have.length(1);

        const postcodes = result.filterOptions.postcodes;
        expect(postcodes).to.have.length(2);
        expect(postcodes[0]).to.contain({ value: 'SW11AA', text: 'SW1 1AA', checked: false });
        expect(postcodes[1]).to.contain({ value: 'SW21AA', text: 'SW2 1AA', checked: true });

        const prosecutors = result.filterOptions.prosecutors;
        expect(prosecutors).to.have.length(3);
        expect(prosecutors[0]).to.contain({ value: 'Orgname1', text: 'Org name 1', checked: false });
        expect(prosecutors[1]).to.contain({ value: 'Orgname2', text: 'Org name 2', checked: false });
        expect(prosecutors[2]).to.contain({ value: 'Orgname3', text: 'Org name,3', checked: false });
    });

    it('should return all SJP cases when applying all postcode filters', async () => {
        const result = filterService.generateFilters(allCases, 'SW11AA,SW21AA', undefined);
        expect(result.sjpCases).to.have.length(4);

        const postcodes = result.filterOptions.postcodes;
        expect(postcodes).to.have.length(2);
        expect(postcodes[0]).to.contain({ value: 'SW11AA', text: 'SW1 1AA', checked: true });
        expect(postcodes[1]).to.contain({ value: 'SW21AA', text: 'SW2 1AA', checked: true });

        const prosecutors = result.filterOptions.prosecutors;
        expect(prosecutors).to.have.length(3);
        expect(prosecutors[0]).to.contain({ value: 'Orgname1', text: 'Org name 1', checked: false });
        expect(prosecutors[1]).to.contain({ value: 'Orgname2', text: 'Org name 2', checked: false });
        expect(prosecutors[2]).to.contain({ value: 'Orgname3', text: 'Org name,3', checked: false });
    });

    it('should return filtered SJP cases when applying a single prosecutor filter', async () => {
        const result = filterService.generateFilters(allCases, 'Orgname1', undefined);
        expect(result.sjpCases).to.have.length(1);

        const postcodes = result.filterOptions.postcodes;
        expect(postcodes).to.have.length(2);
        expect(postcodes[0]).to.contain({ value: 'SW11AA', text: 'SW1 1AA', checked: false });
        expect(postcodes[1]).to.contain({ value: 'SW21AA', text: 'SW2 1AA', checked: false });

        const prosecutors = result.filterOptions.prosecutors;
        expect(prosecutors).to.have.length(3);
        expect(prosecutors[0]).to.contain({ value: 'Orgname1', text: 'Org name 1', checked: true });
        expect(prosecutors[1]).to.contain({ value: 'Orgname2', text: 'Org name 2', checked: false });
        expect(prosecutors[2]).to.contain({ value: 'Orgname3', text: 'Org name,3', checked: false });
    });

    it('should return filtered SJP cases when applying multiple prosecutor filter', async () => {
        const result = filterService.generateFilters(allCases, 'Orgname1,Orgname2', undefined);
        expect(result.sjpCases).to.have.length(2);

        const postcodes = result.filterOptions.postcodes;
        expect(postcodes).to.have.length(2);
        expect(postcodes[0]).to.contain({ value: 'SW11AA', text: 'SW1 1AA', checked: false });
        expect(postcodes[1]).to.contain({ value: 'SW21AA', text: 'SW2 1AA', checked: false });

        const prosecutors = result.filterOptions.prosecutors;
        expect(prosecutors).to.have.length(3);
        expect(prosecutors[0]).to.contain({ value: 'Orgname1', text: 'Org name 1', checked: true });
        expect(prosecutors[1]).to.contain({ value: 'Orgname2', text: 'Org name 2', checked: true });
        expect(prosecutors[2]).to.contain({ value: 'Orgname3', text: 'Org name,3', checked: false });
    });

    it('should return all SJP cases when applying all prosecutor filters', async () => {
        const result = filterService.generateFilters(allCases, 'Orgname1,Orgname2,Orgname3', undefined);
        expect(result.sjpCases).to.have.length(4);

        const postcodes = result.filterOptions.postcodes;
        expect(postcodes).to.have.length(2);
        expect(postcodes[0]).to.contain({ value: 'SW11AA', text: 'SW1 1AA', checked: false });
        expect(postcodes[1]).to.contain({ value: 'SW21AA', text: 'SW2 1AA', checked: false });

        const prosecutors = result.filterOptions.prosecutors;
        expect(prosecutors).to.have.length(3);
        expect(prosecutors[0]).to.contain({ value: 'Orgname1', text: 'Org name 1', checked: true });
        expect(prosecutors[1]).to.contain({ value: 'Orgname2', text: 'Org name 2', checked: true });
        expect(prosecutors[2]).to.contain({ value: 'Orgname3', text: 'Org name,3', checked: true });
    });

    it('should return filtered SJP cases when applying overlapped postcode and prosecutor filters', async () => {
        const result = filterService.generateFilters(allCases, 'SW11AA,Orgname3', undefined);
        expect(result.sjpCases).to.have.length(2);

        const postcodes = result.filterOptions.postcodes;
        expect(postcodes).to.have.length(2);
        expect(postcodes[0]).to.contain({ value: 'SW11AA', text: 'SW1 1AA', checked: true });
        expect(postcodes[1]).to.contain({ value: 'SW21AA', text: 'SW2 1AA', checked: false });

        const prosecutors = result.filterOptions.prosecutors;
        expect(prosecutors).to.have.length(3);
        expect(prosecutors[0]).to.contain({ value: 'Orgname1', text: 'Org name 1', checked: false });
        expect(prosecutors[1]).to.contain({ value: 'Orgname2', text: 'Org name 2', checked: false });
        expect(prosecutors[2]).to.contain({ value: 'Orgname3', text: 'Org name,3', checked: true });
    });

    it('should return no SJP cases when applying non-overlap[ped postcode and prosecutor filters', async () => {
        const result = filterService.generateFilters(allCases, 'SW11AA,Orgname1', undefined);
        expect(result.sjpCases).to.be.empty;

        const postcodes = result.filterOptions.postcodes;
        expect(postcodes).to.have.length(2);
        expect(postcodes[0]).to.contain({ value: 'SW11AA', text: 'SW1 1AA', checked: true });
        expect(postcodes[1]).to.contain({ value: 'SW21AA', text: 'SW2 1AA', checked: false });

        const prosecutors = result.filterOptions.prosecutors;
        expect(prosecutors).to.have.length(3);
        expect(prosecutors[0]).to.contain({ value: 'Orgname1', text: 'Org name 1', checked: true });
        expect(prosecutors[1]).to.contain({ value: 'Orgname2', text: 'Org name 2', checked: false });
        expect(prosecutors[2]).to.contain({ value: 'Orgname3', text: 'Org name,3', checked: false });
    });
});
