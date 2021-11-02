import { expect } from 'chai';
import { FilterService } from '../../../main/service/filterService';

const filterService = new FilterService();

const validFilterName = 'jurisdiction';
const invalidFilterName = 'foo';
const validCourtsList = [
  {name: 'Court 1', jurisdiction: 'crown court', courtId: 1, location: '', hearingList: [], hearings: 0 },
  {name: 'Court 2', jurisdiction: 'magistrate court', courtId: 2, location: '', hearingList: [], hearings: 0},
  {name: 'Court 3', jurisdiction: 'crown court', courtId: 3, location: '', hearingList: [], hearings: 0},
  {name: 'Court 4', jurisdiction: 'crown', courtId: 4, location: '', hearingList: [], hearings: 0},
];

const emptyList = [];
const validDistinctValues = ['crown court', 'magistrate court', 'crown'];

describe('Filter Service', () => {
  it('should return list of distinct values', () => {
    expect(filterService.getFilterValueOptions(validFilterName, validCourtsList)).to.deep.equal(validDistinctValues);
  });

  it('should return empty list', () => {
    expect(filterService.getFilterValueOptions(invalidFilterName, emptyList)).to.deep.equal(emptyList);
  });
});
