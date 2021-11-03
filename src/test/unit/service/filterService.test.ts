import { expect } from 'chai';
import { FilterService } from '../../../main/service/filterService';
import fs from 'fs';
import path from 'path';

const filterService = new FilterService();
const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/courtAndHearings.json'), 'utf-8');
const listData = JSON.parse(rawData);
const validFilterName = 'jurisdiction';
const invalidFilterName = 'foo';

const emptyList = [];
const validFilterNames = ['Jurisdiction', 'Region'];
const validDistinctValues = ['Crown Court', 'Royal Court'];

describe('Filter Service', () => {
  it('should return list of distinct values', () => {
    expect(filterService.getFilterValueOptions(validFilterName, listData)).to.deep.equal(validDistinctValues);
  });

  it('should return empty list', () => {
    expect(filterService.getFilterValueOptions(invalidFilterName, emptyList)).to.deep.equal(emptyList);
  });

  it('should build filter values options for checkboxes', () => {
    const filterOptions = filterService.buildFilterValueOptions(validFilterNames, listData, []);
    expect(Object.keys(filterOptions)).to.deep.equal(validFilterNames);
    expect(Object.keys(filterOptions['Jurisdiction'])[0]).to.equal('Crown Court');
    expect(Object.keys(filterOptions['Jurisdiction'])[1]).to.equal('Royal Court');
    expect(Object.keys(filterOptions['Region'])[0]).to.equal('Bedford');
    expect(Object.keys(filterOptions['Region'])[1]).to.equal('London');
    expect(Object.keys(filterOptions['Region'])[2]).to.equal('Manchester');
  });

  it('should build filters options for checkboxes with checked false', () => {
    const filterOptions = filterService.buildFilterValueOptions(validFilterNames, listData, []);
    expect(filterOptions['Jurisdiction']['Crown Court'].checked).to.equal(false);
  });

  it('should build filters options for checkboxes with checked true', () => {
    const filterOptions = filterService.buildFilterValueOptions(validFilterNames, listData, ['Crown Court']);
    expect(filterOptions['Jurisdiction']['Crown Court'].checked).to.equal(true);
  });

  it('should return empty array if clear is set to all', () => {
    expect(filterService.handleFilterClear(['test', 'foo'], 'all')).to.deep.equal(emptyList);
  });

  it('should remove item in array', () => {
    expect(filterService.handleFilterClear(['test', 'removed'], 'removed')).to.deep.equal(['test']);
  });

  it('should remove item in array leaving empty', () => {
    expect(filterService.handleFilterClear(['removed'], 'removed')).to.deep.equal(emptyList);
  });

  it('should return no keys needed for no checked options', () => {
    const filterOptions = filterService.buildFilterValueOptions(validFilterNames, listData, []);
    expect(filterService.reCreateKeysList(validFilterNames, filterOptions)).to.deep.equal(emptyList);
  });

  it('should return Jurisdiction needed for checked options', () => {
    const filterOptions = filterService.buildFilterValueOptions(validFilterNames, listData, ['Crown Court']);
    expect(filterService.reCreateKeysList(validFilterNames, filterOptions)).to.deep.equal(['Jurisdiction']);
  });

  it('should return Location needed for checked options', () => {
    const filterOptions = filterService.buildFilterValueOptions(validFilterNames, listData, ['London']);
    expect(filterService.reCreateKeysList(validFilterNames, filterOptions)).to.deep.equal(['Location']);
  });

  it('should return both keys needed for checked options', () => {
    const filterOptions = filterService.buildFilterValueOptions(validFilterNames, listData, ['London', 'Crown Court']);
    expect(filterService.reCreateKeysList(validFilterNames, filterOptions)).to.deep.equal(['Jurisdiction', 'Location']);
  });
});
