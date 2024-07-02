import { SjpFilterService } from '../../../main/service/SjpFilterService';

const filterService = new SjpFilterService();

describe('SJP filter service', () => {
    it('should return all filters when not cleared', async () => {
        const filterValues = 'A1,B1,C1,D1';
        const filterClear = '';

        expect(filterService.generateFilterValues(filterValues, filterClear)).toEqual(['A1', 'B1', 'C1', 'D1']);
    });

    it('should return all filters when filter values is an array', async () => {
        const filterValues = ['A1', 'B1', 'C1', 'D1'];
        const filterClear = '';

        expect(filterService.generateFilterValues(filterValues, filterClear)).toEqual(['A1', 'B1', 'C1', 'D1']);
    });

    it('should return no filters when clear all is set', async () => {
        const filterValues = ['A1', 'B1', 'C1', 'D1'];
        const filterClear = 'all';

        expect(filterService.generateFilterValues(filterValues, filterClear)).toEqual([]);
    });

    it('should not return the cleared value', async () => {
        const filterValues = ['A1', 'B1', 'C1', 'D1'];
        const filterClear = 'C1';

        expect(filterService.generateFilterValues(filterValues, filterClear)).toEqual(['A1', 'B1', 'D1']);
    });

    it('should include case when postcode is matching', async () => {
        const filterValues = ['A1', 'B1', 'C1', 'D1'];
        const testCase = { postcode: 'A1', prosecutorName: 'Prosecutor 1' };

        expect(filterService.filterSjpCase(testCase, filterValues)).toBeTruthy();
    });

    it('should include case when prosecutor is matching', async () => {
        const filterValues = ['Prosecutor1'];
        const testCase = { postcode: 'A1', prosecutorName: 'Prosecutor 1' };

        expect(filterService.filterSjpCase(testCase, filterValues)).toBeTruthy();
    });

    it('should not include case when postcode is not matching', async () => {
        const filterValues = ['A1', 'B1', 'C1', 'D1'];
        const testCase = { postcode: 'Z1', prosecutorName: 'Prosecutor 1' };

        expect(filterService.filterSjpCase(testCase, filterValues)).toBeFalsy();
    });

    it('should not include case when prosecutor is not matching', async () => {
        const filterValues = ['Prosecutor2'];
        const testCase = { postcode: 'A1', prosecutorName: 'Prosecutor 1' };

        expect(filterService.filterSjpCase(testCase, filterValues)).toBeFalsy();
    });

    it('should include case when London Postcode area matches postcode', async () => {
        const filterValues = ['London Postcodes'];
        const testCase = { postcode: 'E1', prosecutorName: 'Prosecutor 1' };

        expect(filterService.filterSjpCase(testCase, filterValues)).toBeTruthy();
    });

    it('should not include case when London Postcode does not match postcode', async () => {
        const filterValues = ['London Postcodes'];
        const testCase = { postcode: 'AA1', prosecutorName: 'Prosecutor 1' };

        expect(filterService.filterSjpCase(testCase, filterValues)).toBeFalsy();
    });

    it('test that previous button is included if page > 1', async () => {
        const paginationData = filterService.generatePaginationData(4500, 2, '1234', 'A1', 'sjp-public-list');

        expect(paginationData['previous']).toBeDefined();
        expect(paginationData['previous']).toEqual({ href: 'sjp-public-list?artefactId=1234&filterValues=A1&page=1' });
    });

    it('test that previous button is not included if page == 1', async () => {
        const paginationData = filterService.generatePaginationData(4500, 1, '1234', 'A1', 'sjp-public-list');

        expect(paginationData['previous']).not.toBeDefined();
    });

    it('test that next button is included if page < total pages', async () => {
        const paginationData = filterService.generatePaginationData(4500, 2, '1234', 'A1', 'sjp-public-list');

        expect(paginationData['next']).toBeDefined();
        expect(paginationData['next']).toEqual({ href: 'sjp-public-list?artefactId=1234&filterValues=A1&page=3' });
    });

    it('test that next button is not included if page >= to limit', async () => {
        const paginationData = filterService.generatePaginationData(4500, 5, '1234', 'A1', 'sjp-public-list');

        expect(paginationData['next']).not.toBeDefined();
    });

    it('test that page 1 is always defined', async () => {
        const paginationData = filterService.generatePaginationData(15000, 8, '1234', 'A1', 'sjp-public-list');

        expect(paginationData['items']).toBeDefined();
        expect(paginationData['items']).toContainEqual({
            current: false,
            href: 'sjp-public-list?artefactId=1234&filterValues=A1&page=1',
            number: 1,
        });
    });

    it('test that the final page is always defined', async () => {
        const paginationData = filterService.generatePaginationData(15500, 14, '1234', 'A1', 'sjp-public-list');

        expect(paginationData['items']).toBeDefined();
        expect(paginationData['items']).toContainEqual({
            current: false,
            href: 'sjp-public-list?artefactId=1234&filterValues=A1&page=16',
            number: 16,
        });
    });

    it('test that only one ellipsis is shown when on pages within 3 of start', async () => {
        const paginationData = filterService.generatePaginationData(15500, 2, '1234', 'A1', 'sjp-public-list');

        expect(paginationData['items']).toBeDefined();
        expect(
            (paginationData['items'] as any[]).filter(
                item => JSON.stringify(item) === JSON.stringify({ ellipsis: true })
            ).length
        ).toEqual(1);
    });

    it('test that only one ellipsis is shown when on pages within 3 to the end', async () => {
        const paginationData = filterService.generatePaginationData(15500, 15, '1234', 'A1', 'sjp-public-list');

        expect(paginationData['items']).toBeDefined();
        expect(
            (paginationData['items'] as any[]).filter(
                item => JSON.stringify(item) === JSON.stringify({ ellipsis: true })
            ).length
        ).toEqual(1);
    });

    it('test that two ellipsis are shown when on a page in the middle', async () => {
        const paginationData = filterService.generatePaginationData(15500, 10, '1234', 'A1', 'sjp-public-list');

        expect(paginationData['items']).toBeDefined();
        expect(
            (paginationData['items'] as any[]).filter(
                item => JSON.stringify(item) === JSON.stringify({ ellipsis: true })
            ).length
        ).toEqual(2);
    });

    it('test when number of pages is < 10, then no ellipsis are shown', async () => {
        const paginationData = filterService.generatePaginationData(7500, 4, '1234', 'A1', 'sjp-public-list');

        expect(paginationData['items']).toBeDefined();
        expect(
            (paginationData['items'] as any[]).filter(
                item => JSON.stringify(item) === JSON.stringify({ ellipsis: true })
            ).length
        ).toEqual(0);
    });

    it('test all pages are shown when number of pages is < 10', async () => {
        const paginationData = filterService.generatePaginationData(7500, 4, '1234', 'A1', 'sjp-public-list');

        expect(paginationData['items']).toBeDefined();
        expect((paginationData['items'] as any[]).length).toEqual(8);
    });

    it('test when on page 1, then pages 1, 2 and 3 are shown', async () => {
        const paginationData = filterService.generatePaginationData(21500, 1, '1234', 'A1', 'sjp-public-list');

        expect(paginationData['items']).toBeDefined();
        expect((paginationData['items'] as any[])[0]).toEqual({
            current: true,
            href: 'sjp-public-list?artefactId=1234&filterValues=A1&page=1',
            number: 1,
        });
        expect((paginationData['items'] as any[])[1]).toEqual({
            current: false,
            href: 'sjp-public-list?artefactId=1234&filterValues=A1&page=2',
            number: 2,
        });
        expect((paginationData['items'] as any[])[2]).toEqual({
            current: false,
            href: 'sjp-public-list?artefactId=1234&filterValues=A1&page=3',
            number: 3,
        });
    });

    it('test when on page 2, then pages 1, 2 and 3 are shown', async () => {
        const paginationData = filterService.generatePaginationData(21500, 2, '1234', 'A1', 'sjp-public-list');

        expect(paginationData['items']).toBeDefined();
        expect((paginationData['items'] as any[])[0]).toEqual({
            current: false,
            href: 'sjp-public-list?artefactId=1234&filterValues=A1&page=1',
            number: 1,
        });
        expect((paginationData['items'] as any[])[1]).toEqual({
            current: true,
            href: 'sjp-public-list?artefactId=1234&filterValues=A1&page=2',
            number: 2,
        });
        expect((paginationData['items'] as any[])[2]).toEqual({
            current: false,
            href: 'sjp-public-list?artefactId=1234&filterValues=A1&page=3',
            number: 3,
        });
    });

    it('test when on last page, then the three last pages are shown', async () => {
        const paginationData = filterService.generatePaginationData(21500, 22, '1234', 'A1', 'sjp-public-list');

        expect(paginationData['items']).toBeDefined();
        expect((paginationData['items'] as any[])[4]).toEqual({
            current: true,
            href: 'sjp-public-list?artefactId=1234&filterValues=A1&page=22',
            number: 22,
        });
        expect((paginationData['items'] as any[])[3]).toEqual({
            current: false,
            href: 'sjp-public-list?artefactId=1234&filterValues=A1&page=21',
            number: 21,
        });
        expect((paginationData['items'] as any[])[2]).toEqual({
            current: false,
            href: 'sjp-public-list?artefactId=1234&filterValues=A1&page=20',
            number: 20,
        });
    });

    it('test when on second to last page, then the three last pages are shown', async () => {
        const paginationData = filterService.generatePaginationData(21500, 21, '1234', 'A1', 'sjp-public-list');

        expect(paginationData['items']).toBeDefined();
        expect((paginationData['items'] as any[])[4]).toEqual({
            current: false,
            href: 'sjp-public-list?artefactId=1234&filterValues=A1&page=22',
            number: 22,
        });
        expect((paginationData['items'] as any[])[3]).toEqual({
            current: true,
            href: 'sjp-public-list?artefactId=1234&filterValues=A1&page=21',
            number: 21,
        });
        expect((paginationData['items'] as any[])[2]).toEqual({
            current: false,
            href: 'sjp-public-list?artefactId=1234&filterValues=A1&page=20',
            number: 20,
        });
    });
});
