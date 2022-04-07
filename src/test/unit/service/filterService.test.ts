import {FilterService} from '../../../main/service/filterService';
import fs from 'fs';
import path from 'path';

const filterService = new FilterService();

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/courtAndHearings.json'), 'utf-8');
const listData = JSON.parse(rawData);

const magsCourt = 'Magistrates\' Court';
const crownCourt = 'Crown Court';
const royalCourt = 'Royal Court';
const bedfordRegion = 'Bedford';
const londonRegion = 'London';
const manchesterRegion = 'Manchester';
const jurisdiction = {courtField: 'Jurisdiction', filterName: 'Type of court or tribunal'};
const region = {courtField: 'Region', filterName: 'Region'};
const filterOptions = {'Type of court or tribunal': {'Crown Court': {checked: true}, Crown: {checked: false}}, Region: {Bedford: {checked: false}, Hull: {checked: true}}};
const filterOptionsNoJurisdiction = {'Type of court or tribunal': {'Crown Court': {checked: false}, Crown: {checked: false}}, Region: {Bedford: {checked: false}, Hull: {checked: true}}};
const filterOptionsNoRegion = {'Type of court or tribunal': {'Crown Court': {checked: true}, Crown: {checked: false}}, Region: {Bedford: {checked: false}, Hull: {checked: false}}};
const filterOptionsNoFilters = {'Type of court or tribunal': {'Crown Court': {checked: false}, Crown: {checked: false}}, Region: {Bedford: {checked: false}, Hull: {checked: false}}};
const requestFilters = {'Type of court or tribunal': 'Crown Court', Region: 'Bedford'};
const requestFiltersNoRegion = {'Type of court or tribunal': ['Crown Court', 'Tribunal']};
const requestFiltersNoJurisdiction = {Region: 'Bedford'};
const filterNames = ['Type of court or tribunal', 'Region'];
const allFilterOptions = {'Type of court or tribunal': {Tribunal:{value:'Tribunal'}}, Region: {Wales:{value:'Wales'}}};
const filterValues = ['Tribunal','Wales'];

describe('Filter Service', () => {
  it('should build filter header options for checkboxes', () => {
    expect(Object.keys(filterService.buildFilterValueOptions(listData, [])).length).toBe(2);
  });

  it('should build filter values options for checkboxes', () => {
    const data = filterService.buildFilterValueOptions(listData, []);
    expect(Object.keys(data[jurisdiction.filterName])[0]).toBe(crownCourt);
    expect(Object.keys(data[jurisdiction.filterName])[1]).toBe(magsCourt);
    expect(Object.keys(data[jurisdiction.filterName])[2]).toBe(royalCourt);
    expect(Object.keys(data[region.filterName])[0]).toBe(bedfordRegion);
    expect(Object.keys(data[region.filterName])[1]).toBe(londonRegion);
    expect(Object.keys(data[region.filterName])[2]).toBe(manchesterRegion);
  });

  it('should build filters options for checkboxes with checked false', () => {
    const data = filterService.buildFilterValueOptions(listData, []);
    expect(data[jurisdiction.filterName][crownCourt]['checked']).toBe(false);
  });

  it('should build filters options for checkboxes with checked true', () => {
    const data = filterService.buildFilterValueOptions(listData, ['Crown Court']);
    expect(data[jurisdiction.filterName][crownCourt]['checked']).toBe(true);
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

  it('should return no keys needed for no checked options', () => {
    expect(filterService.handleKeys(filterOptionsNoFilters)).toStrictEqual([]);
  });

  it('should return Jurisdiction needed for checked options', () => {
    expect(filterService.handleKeys(filterOptionsNoRegion)).toStrictEqual([jurisdiction]);
  });

  it('should return Location needed for checked options', () => {
    expect(filterService.handleKeys(filterOptionsNoJurisdiction)).toStrictEqual([region]);
  });

  it('should return both keys needed for checked options', () => {
    expect(filterService.handleKeys(filterOptions)).toStrictEqual([jurisdiction, region]);
  });

  it('should return both Jurisdiction and Region', () => {
    expect(filterService.splitFilters(filterNames, requestFilters)).toStrictEqual(requestFilters);
  });

  it('should return only Region', () => {
    expect(filterService.splitFilters(filterNames, requestFiltersNoJurisdiction)).toStrictEqual({'Type of court or tribunal': '', Region: 'Bedford'});
  });

  it('should return only Jurisdiction', () => {
    expect(filterService.splitFilters(filterNames, requestFiltersNoRegion)).toStrictEqual({'Type of court or tribunal': 'Crown Court,Tribunal', Region: ''});
  });

  it('should find and return both Jurisdiction and Region', () => {
    expect(filterService.findAndSplitFilters(filterValues, allFilterOptions)).toStrictEqual({'Type of court or tribunal': 'Tribunal', Region: 'Wales'});
  });

  it('should find and return only Region', () => {
    expect(filterService.findAndSplitFilters(filterValues, {'Type of court or tribunal': '', Region: {Wales:{value:'Wales'}}})).toStrictEqual({'Type of court or tribunal': '', Region: 'Wales'});
  });

  it('should find and return only Jurisdiction', () => {
    expect(filterService.findAndSplitFilters(filterValues, {'Type of court or tribunal': {Tribunal:{value:'Tribunal'}}, Region: ''})).toStrictEqual({'Type of court or tribunal': 'Tribunal', Region: ''});
  });
});
