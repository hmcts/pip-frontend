import { describe } from '@jest/globals';
import { SjpModel } from '../../../main/models/style-guide/sjp-model';

describe('SJP Model Test', () => {
    it('test add total case number', () => {
        const sjpModel = new SjpModel();
        sjpModel.addTotalCaseNumber();
        expect(sjpModel.getTotalNumberOfCases()).toBe(1);
    });

    it('test set current page when page is not defined', () => {
        const sjpModel = new SjpModel();
        expect(sjpModel.setCurrentPage(undefined)).toBe(1);
    });

    it('test set current page when page is not a number', () => {
        const sjpModel = new SjpModel();
        expect(sjpModel.setCurrentPage(['a', 'b'])).toBe(1);
    });

    it('test set current page when page is a number', () => {
        const sjpModel = new SjpModel();
        expect(sjpModel.setCurrentPage('4')).toBe(4);
    });

    it('test add a postcode when not london area', () => {
        const sjpModel = new SjpModel();
        sjpModel.addPostcode('AA1 AAA');

        expect(sjpModel.getPostcodes()).toContain('AA1');
        expect(sjpModel.containsLondonPostcodeArea()).toBe(false);
    });

    it('test add a postcode when london area', () => {
        const sjpModel = new SjpModel();
        sjpModel.addPostcode('E1 AAA');

        expect(sjpModel.getPostcodes()).toContain('E1');
        expect(sjpModel.containsLondonPostcodeArea()).toBe(true);
    });

    it('test add a prosecutor', () => {
        const sjpModel = new SjpModel();
        sjpModel.addProsecutor('This is a prosecutor');

        expect(sjpModel.getProsecutors()).toContain('This is a prosecutor');
    });

    it('test sort postcodes', () => {
        const sjpModel = new SjpModel();
        sjpModel.addPostcode('Z1');
        sjpModel.addPostcode('A1');
        sjpModel.addPostcode('B1');

        expect(sjpModel.sortPostcodes()).toEqual(['A1', 'B1', 'Z1']);
    });

    it('test sort prosecutors', () => {
        const sjpModel = new SjpModel();
        sjpModel.addProsecutor('Prosecutor 4');
        sjpModel.addProsecutor('Prosecutor 2');
        sjpModel.addProsecutor('Prosecutor 8');

        expect(sjpModel.sortProsecutors()).toEqual(['Prosecutor 2', 'Prosecutor 4', 'Prosecutor 8']);
    });

    it('test set current filter values', () => {
        const sjpModel = new SjpModel();
        sjpModel.setCurrentFilterValues(['Filter 1', 'Filter 2']);
        expect(sjpModel.getCurrentFilterValues()).toEqual(['Filter 1', 'Filter 2']);
    });

    it('test add filtered case', () => {
        const sjpModel = new SjpModel();
        sjpModel.addFilteredCaseForPage({ test: 'Test 1' });
        expect(sjpModel.getFilteredCasesForPage()).toEqual([{ test: 'Test 1' }]);
    });

    it('test is row within page limit when below range', () => {
        const sjpModel = new SjpModel();

        sjpModel.setCurrentPage(1);
        sjpModel.setCountOfFilteredCases(2000);

        expect(sjpModel.isRowWithinPage()).toEqual(false);
    });

    it('test is row within page limit when inside range', () => {
        const sjpModel = new SjpModel();

        sjpModel.setCurrentPage(2);
        sjpModel.setCountOfFilteredCases(2000);

        expect(sjpModel.isRowWithinPage()).toEqual(true);
    });

    it('test increment total filtered case count', () => {
        const sjpModel = new SjpModel();

        sjpModel.incrementCountOfFilteredCases();
        sjpModel.incrementCountOfFilteredCases();

        expect(sjpModel.getCountOfFilteredCases()).toEqual(2);
    });

    it('test is row within page limit when above range', () => {
        const sjpModel = new SjpModel();

        sjpModel.setCurrentPage(3);
        sjpModel.setCountOfFilteredCases(2000);

        expect(sjpModel.isRowWithinPage()).toEqual(false);
    });

    it('test generate postcode filters', () => {
        const sjpModel = new SjpModel();

        sjpModel.addPostcode('AA2');
        sjpModel.addPostcode('AA1');
        sjpModel.addPostcode('E1');
        sjpModel.setCurrentFilterValues(['AA1']);
        sjpModel.generatePostcodeFilters();

        expect(sjpModel.getPostcodeFilters()).toEqual([
            {
                value: 'AA1',
                text: 'AA1',
                checked: true,
            },
            {
                value: 'AA2',
                text: 'AA2',
                checked: false,
            },
            {
                value: 'E1',
                text: 'E1',
                checked: false,
            },
            {
                value: 'London Postcodes',
                text: 'London Postcodes',
                checked: false,
            },
        ]);
    });

    it('test generate prosecutor filters', () => {
        const sjpModel = new SjpModel();

        sjpModel.addProsecutor('This is a prosecutor 4');
        sjpModel.addProsecutor('This is a prosecutor 2');
        sjpModel.addProsecutor('This is a prosecutor 3');
        sjpModel.setCurrentFilterValues(['Thisisaprosecutor4']);
        sjpModel.generateProsecutorFilters()

        expect(sjpModel.getProsecutorFilters()).toEqual([
            {
                value: 'Thisisaprosecutor2',
                text: 'This is a prosecutor 2',
                checked: false,
            },
            {
                value: 'Thisisaprosecutor3',
                text: 'This is a prosecutor 3',
                checked: false,
            },
            {
                value: 'Thisisaprosecutor4',
                text: 'This is a prosecutor 4',
                checked: true,
            },
        ]);
    });

    it('test get current postcode and prosecutor filter values', () => {
        const sjpModel = new SjpModel();

        sjpModel.addPostcode('AA1');
        sjpModel.addPostcode('AA2');
        sjpModel.addPostcode('EC1A');
        sjpModel.addProsecutor('This is a prosecutor');
        sjpModel.addProsecutor('This is a prosecutor 2');
        sjpModel.addProsecutor('This is a prosecutor 3');

        sjpModel.setCurrentFilterValues(['AA1', 'London Postcodes', 'Thisisaprosecutor', 'Thisisaprosecutor3']);
        sjpModel.generatePostcodeFilters();
        sjpModel.generateProsecutorFilters();

        expect(sjpModel.getCurrentPostcodeFilterValues()).toEqual(['AA1', 'London Postcodes']);
        expect(sjpModel.getCurrentProsecutorFilterValues()).toEqual(['Thisisaprosecutor', 'Thisisaprosecutor3']);
    });
});
