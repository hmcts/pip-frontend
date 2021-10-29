import { expect } from 'chai';
import { FilterService } from '../../../main/service/filterService';

const filterService = new FilterService();

const validFilterName = 'jurisdiction';
const invalidFilterName = 'foo';
const validCourtsList = [
  {name: 'Court 1', jurisdiction: 'crown court'},
  {name: 'Court 2', jurisdiction: 'magistrate court'},
  {name: 'Court 3', jurisdiction: 'crown court'},
  {name: 'Court 4', jurisdiction: 'crown'},
];
const emptyList = [];
const validDistinctValues = ['crown court', 'magistrate court', 'crown'];
const validObjectKeys = ['idPrefix', 'name', 'classes', 'fieldset', 'items'];
const validSelectionCombination = [ { jurisdiction: ['magistrate court'] }, { location: ['bar'] } ];
const validIndividualSelection = [ { jurisdiction: ['crown'] }, { location: [] } ];
const validCheckedItems = { jurisdiction: [], region: [] };

describe('Filter Service', () => {
  it('should return list of distinct values', () => {
    expect(filterService.getDistinctValues(validFilterName, validCourtsList)).to.deep.equal(validDistinctValues);
  });

  it('should return empty list', () => {
    expect(filterService.getDistinctValues(invalidFilterName, emptyList)).to.deep.equal(emptyList);
  });

  it('should return list of 3 checkbox objects', () => {
    expect(filterService.generateCheckboxObjects(validDistinctValues, validFilterName, validCourtsList).length).to.equal(3);
  });

  it('should return empty list of checkbox objects', () => {
    expect(filterService.generateCheckboxObjects(validDistinctValues, invalidFilterName, emptyList)).to.deep.equal(emptyList);
  });

  it('should return empty list for empty data', () => {
    expect(filterService.generateCheckboxGroups(emptyList, emptyList)).to.deep.equal(emptyList);
  });

  it('should return list of checkbox group objects with valid keys for valid data', () => {
    const objectsList = filterService.generateCheckboxGroups(validCheckedItems, validCourtsList);
    expect(objectsList.length).to.equal(2);
    expect(Object.keys(objectsList[0])).to.deep.equal(validObjectKeys);
  });

  it('should return empty list if there are no selected tags', () => {
    expect(filterService.generateSelectedTags(emptyList)).to.deep.equal(emptyList);
  });

  it('should return list of 2 selected tags for valid data', () => {
    expect(filterService.generateSelectedTags(validSelectionCombination).length).to.equal(2);
  });

  it('should return list of 1 selected tag for valid data', () => {
    expect(filterService.generateSelectedTags(validIndividualSelection).length).to.equal(1);
  });
});
