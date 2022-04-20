import {FilterService} from '../../../main/service/filterService';
import fs from 'fs';
import path from 'path';
import {CourtService} from '../../../main/service/courtService';
import sinon from 'sinon';

const filterService = new FilterService();

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/courtAndHearings.json'), 'utf-8');
const listData = JSON.parse(rawData);

sinon.stub(CourtService.prototype, 'generateAlphabetisedAllCourtList').resolves(listData);
sinon.stub(CourtService.prototype, 'generateFilteredAlphabetisedCourtList').resolves([listData[0]]);
sinon.stub(CourtService.prototype, 'fetchAllCourts').resolves(listData);

const magsCourt = 'Magistrates\' Court';
const crownCourt = 'Crown Court';
const royalCourt = 'Royal Court';
const bedfordRegion = 'Bedford';
const londonRegion = 'London';
const manchesterRegion = 'Manchester';
const jurisdiction = 'Jurisdiction';
const region = 'Region';
const filterOptions = {Jurisdiction: {'Crown Court': {checked: true}, Crown: {checked: false}}, Region: {Bedford: {checked: false}, Hull: {checked: true}}};
const filterOptionsNoJurisdiction = {Jurisdiction: {'Crown Court': {checked: false}, Crown: {checked: false}}, Region: {Bedford: {checked: false}, Hull: {checked: true}}};
const filterOptionsNoRegion = {Jurisdiction: {'Crown Court': {checked: true}, Crown: {checked: false}}, Region: {Bedford: {checked: false}, Hull: {checked: false}}};
const filterOptionsNoFilters = {Jurisdiction: {'Crown Court': {checked: false}, Crown: {checked: false}}, Region: {Bedford: {checked: false}, Hull: {checked: false}}};
const requestFilters = {Jurisdiction: 'Crown Court', Region: 'Bedford'};
const requestFiltersNoRegion = {Jurisdiction: ['Crown Court', 'Tribunal']};
const requestFiltersNoJurisdiction = {Region: 'Bedford'};
const filterNames = ['Jurisdiction', 'Region'];
const allFilterOptions = {Jurisdiction: {Tribunal:{value:'Tribunal'}}, Region: {Wales:{value:'Wales'}}};
const filterValues = ['Tribunal','Wales'];

describe('Filter Service', () => {
  it('should build filter header options for checkboxes', () => {
    expect(Object.keys(filterService.buildFilterValueOptions(listData, [])).length).toBe(2);
  });

  it('should build filter values options for checkboxes', () => {
    const data = filterService.buildFilterValueOptions(listData, []);
    expect(Object.keys(data[jurisdiction])[0]).toBe(crownCourt);
    expect(Object.keys(data[jurisdiction])[1]).toBe(magsCourt);
    expect(Object.keys(data[jurisdiction])[2]).toBe(royalCourt);
    expect(Object.keys(data[region])[0]).toBe(bedfordRegion);
    expect(Object.keys(data[region])[1]).toBe(londonRegion);
    expect(Object.keys(data[region])[2]).toBe(manchesterRegion);
  });

  it('should build filters options for checkboxes with checked false', () => {
    const data = filterService.buildFilterValueOptions(listData, []);
    expect(data[jurisdiction][crownCourt]['checked']).toBe(false);
  });

  it('should build filters options for checkboxes with checked true', () => {
    const data = filterService.buildFilterValueOptions(listData, ['Crown Court']);
    expect(data[jurisdiction][crownCourt]['checked']).toBe(true);
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

  it('should return full array if item already removed', () => {
    expect(filterService.handleFilterClear(['test'], 'removed')).toStrictEqual(['test']);
  });

  it('should return no keys needed for no checked options', () => {
    expect(filterService.handleKeys(filterOptionsNoFilters)).toStrictEqual([]);
  });

  it('should return Jurisdiction needed for checked options', () => {
    expect(filterService.handleKeys(filterOptionsNoRegion)).toStrictEqual(['Jurisdiction']);
  });

  it('should return Location needed for checked options', () => {
    expect(filterService.handleKeys(filterOptionsNoJurisdiction)).toStrictEqual(['Location']);
  });

  it('should return both keys needed for checked options', () => {
    expect(filterService.handleKeys(filterOptions)).toStrictEqual([jurisdiction, 'Location']);
  });

  it('should return both Jurisdiction and Region', () => {
    expect(filterService.splitFilters(filterNames, requestFilters)).toStrictEqual(requestFilters);
  });

  it('should return only Region', () => {
    expect(filterService.splitFilters(filterNames, requestFiltersNoJurisdiction)).toStrictEqual({Jurisdiction: '', Region: 'Bedford'});
  });

  it('should return only Jurisdiction', () => {
    expect(filterService.splitFilters(filterNames, requestFiltersNoRegion)).toStrictEqual({Jurisdiction: 'Crown Court,Tribunal', Region: ''});
  });

  it('should find and return both Jurisdiction and Region', () => {
    expect(filterService.findAndSplitFilters(filterValues, allFilterOptions)).toStrictEqual({Jurisdiction: 'Tribunal', Region: 'Wales'});
  });

  it('should find and return only Region', () => {
    expect(filterService.findAndSplitFilters(filterValues, {Jurisdiction: '', Region: {Wales:{value:'Wales'}}})).toStrictEqual({Jurisdiction: '', Region: 'Wales'});
  });

  it('should find and return only Jurisdiction', () => {
    expect(filterService.findAndSplitFilters(filterValues, {Jurisdiction: {Tribunal:{value:'Tribunal'}}, Region: ''})).toStrictEqual({Jurisdiction: 'Tribunal', Region: ''});
  });

  it('should return array from string', () => {
    expect(filterService.stripFilters('test,filter').length).toEqual(2);
  });

  it('should return empty array if current filters are yet defined', () => {
    expect(filterService.stripFilters(null)).toStrictEqual([]);
  });

  it('should return object for rendering with no clear or filters selected', async () => {
    expect(await filterService.handleFilterInitialisation(null, null)).toStrictEqual({alphabetisedList: listData, filterOptions: {...filterService.buildFilterValueOptions(listData, [])}});
  });

  it('should return all courts when clear all has been passed', async () => {
    expect(await filterService.handleFilterInitialisation('all', null)).toStrictEqual({alphabetisedList: listData, filterOptions: {...filterService.buildFilterValueOptions(listData, [])}});
  });

  it('should return filtered courts if filters have been selected', async () => {
    const result = await filterService.handleFilterInitialisation(null, 'Manchester');
    expect(result['alphabetisedList']).toStrictEqual([listData[0]]);
  });

  it('should return filter values from a key', () => {
    const body = {jurisdiction: ['test', 'val']} as unknown as string;
    expect(filterService.generateFilterKeyValues(body)).toStrictEqual(['test', 'val']);
  });

  it('should return filter values from keys', () => {
    const body = {jurisdiction: ['test', 'val'], region: ['newTest']} as unknown as string;
    expect(filterService.generateFilterKeyValues(body)).toStrictEqual(['test', 'val', 'newTest']);
  });
});
