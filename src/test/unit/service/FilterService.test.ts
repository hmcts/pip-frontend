import { FilterService } from '../../../main/service/FilterService';
import fs from 'fs';
import path from 'path';
import { LocationService } from '../../../main/service/LocationService';
import sinon from 'sinon';

const filterService = new FilterService();

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/courtAndHearings.json'), 'utf-8');
const listData = JSON.parse(rawData);

sinon.stub(LocationService.prototype, 'generateAlphabetisedAllCourtList').resolves(listData);
sinon.stub(LocationService.prototype, 'generateFilteredAlphabetisedCourtList').resolves([listData[0]]);
sinon.stub(LocationService.prototype, 'fetchAllLocations').resolves(listData);

const jurisdiction = 'Jurisdiction';
const civil = 'Civil';
const family = 'Family';
const crime = 'Crime';
const tribunal = 'Tribunal';
const region = 'Region';
const allFilterOptions = {
    Jurisdiction: {
        Crime: { value: 'Crime' },
        Family: { value: 'Family' },
        Tribunal: { value: 'Tribunal' },
    },
    Civil: {},
    Crime: {
        Crown: { value: 'Crown' },
        Magistrates: { value: 'Magistrates' },
    },
    Family: {
        'Family Court': { value: 'Family Court' },
    },
    Tribunal: {
        'Social Security and Child Support': { value: 'Social Security and Child Support' },
    },
    Region: {
        Bedford: { value: 'Bedford' },
        London: { value: 'London' },
        Manchester: { value: 'Manchester' },
    },
};

const englishLanguage = 'en';
const welshLanguage = 'cy';

describe('Filter Service', () => {
    it('should build filter header options for checkboxes', () => {
        expect(Object.keys(filterService.buildFilterValueOptions(listData, [], 'en')).length).toBe(6);
    });

    it('should build filter values options for checkboxes', () => {
        const data = filterService.buildFilterValueOptions(listData, [], 'en');
        expect(Object.keys(data[jurisdiction])).toHaveLength(3);
        expect(Object.keys(data[jurisdiction])[0]).toBe('Crime');
        expect(Object.keys(data[jurisdiction])[1]).toBe('Family');
        expect(Object.keys(data[jurisdiction])[2]).toBe('Tribunal');

        expect(Object.keys(data[civil])).toHaveLength(0);

        expect(Object.keys(data[crime])).toHaveLength(2);
        expect(Object.keys(data[crime])[0]).toBe('Crown Court');
        expect(Object.keys(data[crime])[1]).toBe('Magistrates Court');

        expect(Object.keys(data[family])).toHaveLength(1);
        expect(Object.keys(data[family])[0]).toBe('Family Court');

        expect(Object.keys(data[tribunal])).toHaveLength(1);
        expect(Object.keys(data[tribunal])[0]).toBe('Social Security and Child Support');

        expect(Object.keys(data[region])).toHaveLength(3);
        expect(Object.keys(data[region])[0]).toBe('Bedford');
        expect(Object.keys(data[region])[1]).toBe('London');
        expect(Object.keys(data[region])[2]).toBe('Manchester');
    });

    it('should build filters options for checkboxes with checked false', () => {
        const data = filterService.buildFilterValueOptions(listData, [], 'en');
        expect(data[jurisdiction][crime]['checked']).toBe(false);
        expect(data[crime]['Crown Court']['checked']).toBe(false);
        expect(data[crime]['Magistrates Court']['checked']).toBe(false);
    });

    it('should build filters options for jurisdiction checkboxes', () => {
        const data = filterService.buildFilterValueOptions(listData, ['Crime'], 'en');
        expect(data[jurisdiction][crime]['checked']).toBe(true);
        expect(data[crime]['Crown Court']['checked']).toBe(false);
        expect(data[crime]['Magistrates Court']['checked']).toBe(false);
    });

    it('should build filters options for both jurisdiction and jurisdiction type checkboxes', () => {
        const data = filterService.buildFilterValueOptions(listData, ['Crime', 'Crown Court', 'Magistrates Court'], 'en');
        expect(data[jurisdiction][crime]['checked']).toBe(true);
        expect(data[crime]['Crown Court']['checked']).toBe(true);
        expect(data[crime]['Magistrates Court']['checked']).toBe(true);
    });

    it('should return empty filter options for empty locations', () => {
        const data = filterService.buildFilterValueOptions([], [], 'en');
        expect(data[jurisdiction]).toStrictEqual({});
        expect(data[region]).toStrictEqual({});
    });

    it('should return empty array if clear is set to all', () => {
        expect(filterService.handleFilterClear(['test'], 'all')).toStrictEqual([]);
    });

    it('should remove item in array', () => {
        expect(filterService.handleFilterClear(['test', 'removed'], 'removed')).toStrictEqual(['test']);
    });

    it('should remove item in array leaving empty', () => {
        expect(filterService.handleFilterClear(['removed'], 'removed')).toStrictEqual([]);
    });

    it('should find and return jurisdiction, jurisdiction type and region filters', () => {
        expect(filterService.findAndSplitFilters(['Crime', 'Crown', 'London'], allFilterOptions)).toStrictEqual({
            Jurisdiction: ['Crime'],
            Civil: [],
            Crime: ['Crown'],
            Family: [],
            Tribunal: [],
            Region: ['London'],
        });
    });

    it('should find and return jurisdiction filters only', () => {
        expect(filterService.findAndSplitFilters(['Crime', 'Family'], allFilterOptions)).toStrictEqual({
            Jurisdiction: ['Crime', 'Family'],
            Civil: [],
            Crime: [],
            Family: [],
            Tribunal: [],
            Region: [],
        });
    });

    it('should find and return jurisdiction type filters only', () => {
        expect(filterService.findAndSplitFilters(['Crown', 'Family Court'], allFilterOptions)).toStrictEqual({
            Jurisdiction: [],
            Civil: [],
            Crime: ['Crown'],
            Family: ['Family Court'],
            Tribunal: [],
            Region: [],
        });
    });

    it('should find and return region filters only', () => {
        expect(filterService.findAndSplitFilters(['London', 'Manchester'], allFilterOptions)).toStrictEqual({
            Jurisdiction: [],
            Civil: [],
            Crime: [],
            Family: [],
            Tribunal: [],
            Region: ['London', 'Manchester'],
        });
    });

    it('should return array from string', () => {
        expect(filterService.stripFilters('test,filter').length).toEqual(2);
    });

    it('should return empty array if all filters have been removed', () => {
        expect(filterService.stripFilters(',')).toStrictEqual([]);
    });

    it('should return empty array if current filters are yet defined', () => {
        expect(filterService.stripFilters(null)).toStrictEqual([]);
    });

    it('should return array from array of strings', () => {
        expect(filterService.stripFilters(['test,filter', 'test2'])).toEqual(['test', 'filter', 'test2']);
    });

    it('should return object for rendering with no clear or filters selected', async () => {
        expect(await filterService.handleFilterInitialisation(null, null, englishLanguage)).toStrictEqual({
            alphabetisedList: listData,
            filterOptions: { ...filterService.buildFilterValueOptions(listData, [], 'en') },
            showFilters: {
                Jurisdiction: true,
                Civil: false,
                Crime: false,
                Family: false,
                Tribunal: false,
                Region: true,
            },
        });
    });

    it('should return all courts when clear all has been passed', async () => {
        expect(await filterService.handleFilterInitialisation('all', null, englishLanguage)).toStrictEqual({
            alphabetisedList: listData,
            filterOptions: { ...filterService.buildFilterValueOptions(listData, [], 'en') },
            showFilters: {
                Jurisdiction: true,
                Civil: false,
                Crime: false,
                Family: false,
                Tribunal: false,
                Region: true,
            },
        });
    });

    it('should return filtered courts if jurisdiction filters selected', async () => {
        const result = await filterService.handleFilterInitialisation(null, 'Tribunal', englishLanguage);
        expect(result['alphabetisedList']).toStrictEqual([listData[0]]);
        expect(result['showFilters']).toStrictEqual({
            Jurisdiction: true,
            Civil: false,
            Crime: false,
            Family: false,
            Tribunal: true,
            Region: true,
        });
    });

    it('should return filtered courts if jurisdiction type filters selected', async () => {
        const result = await filterService.handleFilterInitialisation(null, 'Family Court', englishLanguage);
        expect(result['alphabetisedList']).toStrictEqual([listData[0]]);
        expect(result['showFilters']).toStrictEqual({
            Jurisdiction: true,
            Civil: false,
            Crime: false,
            Family: true,
            Tribunal: false,
            Region: true,
        });
    });

    it('should return filtered courts if region filters selected', async () => {
        const result = await filterService.handleFilterInitialisation(null, 'Manchester', englishLanguage);
        expect(result['alphabetisedList']).toStrictEqual([listData[0]]);
        expect(result['showFilters']).toStrictEqual({
            Jurisdiction: true,
            Civil: false,
            Crime: false,
            Family: false,
            Tribunal: false,
            Region: true,
        });
    });

    it('should return filtered courts if multiple filters selected', async () => {
        const result = await filterService.handleFilterInitialisation(
            null,
            'Crime,Tribunal,Magistrates,Family Court',
            englishLanguage
        );
        expect(result['alphabetisedList']).toStrictEqual([listData[0]]);
        expect(result['showFilters']).toStrictEqual({
            Jurisdiction: true,
            Civil: false,
            Crime: true,
            Family: true,
            Tribunal: true,
            Region: true,
        });
    });

    it('should return object for rendering with no clear or filters selected for welsh', async () => {
        expect(await filterService.handleFilterInitialisation(null, null, welshLanguage)).toStrictEqual({
            alphabetisedList: listData,
            filterOptions: { ...filterService.buildFilterValueOptions(listData, [], 'cy') },
            showFilters: {
                Jurisdiction: true,
                Civil: false,
                Crime: false,
                Family: false,
                Tribunal: false,
                Region: true,
            },
        });
    });

    it('should return all courts when clear all has been passed for welsh', async () => {
        expect(await filterService.handleFilterInitialisation('all', null, welshLanguage)).toStrictEqual({
            alphabetisedList: listData,
            filterOptions: { ...filterService.buildFilterValueOptions(listData, [], 'cy') },
            showFilters: {
                Jurisdiction: true,
                Civil: false,
                Crime: false,
                Family: false,
                Tribunal: false,
                Region: true,
            },
        });
    });

    it('should return filtered courts if filters have been selected for welsh', async () => {
        const result = await filterService.handleFilterInitialisation(null, 'Bedford', welshLanguage);
        expect(result['alphabetisedList']).toStrictEqual([listData[0]]);
    });

    it('should return filter values from a key', () => {
        const body = { jurisdiction: ['test', 'val'] } as unknown as string;
        expect(filterService.generateFilterKeyValues(body)).toStrictEqual(['test', 'val']);
    });

    it('should return filter values from keys', () => {
        const body = {
            jurisdiction: ['test', 'val'],
            region: ['newTest'],
        } as unknown as string;
        expect(filterService.generateFilterKeyValues(body)).toStrictEqual(['test', 'val', 'newTest']);
    });
});
