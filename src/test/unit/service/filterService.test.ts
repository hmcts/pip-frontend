import {FilterService} from '../../../main/service/filterService';
import fs from 'fs';
import path from 'path';

const filterService = new FilterService();

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/courtAndHearings.json'), 'utf-8');
const listData = JSON.parse(rawData);

const crownCourt = 'Crown Court';
const royalCourt = 'Royal Court';
const jurisdiction = 'Jurisdiction';
const filterOptions = {Jurisdiction: {'Crown Court': {checked: true}, Crown: {checked: false}}, Region: {Bedford: {checked: false}, Hull: {checked: true}}};

describe('Filter Service', () => {
  it('should build filter header options for checkboxes', () => {
    expect(Object.keys(filterService.buildFilterValueOptions(listData, [])).length).toBe(2);
  });

  it('should build filter values options for checkboxes', () => {
    const data = filterService.buildFilterValueOptions(listData, []);
    expect(Object.keys(data[jurisdiction])[0]).toBe(crownCourt);
    expect(Object.keys(data[jurisdiction])[1]).toBe(royalCourt);
    expect(Object.keys(data['Region'])[0]).toBe('Bedford');
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

  it('should return no keys needed for no checked options', () => {
    expect(filterService.handleKeys(filterOptions, [])).toStrictEqual([]);
  });

  it('should return Jurisdiction needed for checked options', () => {
    expect(filterService.handleKeys(filterOptions, [crownCourt])).toStrictEqual(['Jurisdiction']);
  });

  it('should return Location needed for checked options', () => {
    expect(filterService.handleKeys(filterOptions, ['Hull'])).toStrictEqual(['Location']);
  });

  it('should return both keys needed for checked options', () => {
    expect(filterService.handleKeys(filterOptions, ['Hull', crownCourt])).toStrictEqual([jurisdiction, 'Location']);
  });
});
