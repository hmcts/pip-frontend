import {InputFilterService} from '../../../main/service/inputFilterService';
import {expect} from 'chai';

const inputService = new InputFilterService();

const validSearchInputName = 'Aylesbury Magistrate\'s Court';
const validSearchInputLocation = 'Aylesbury';
const validSearchInputJurisdiction = 'Magistrates Court';
const validCheckAgainst = ['name', 'location', 'jurisdiction'];

const invalidSearchInputEmpty = '';
const invalidSearchInputUndefined = undefined;

const expectedResultFromName = [{
  courtId: 32,
  name: 'Aylesbury Magistrate\'s Court',
  jurisdiction: 'Magistrates Court',
  location: 'Aylesbury',
  hearings: 6,
}];

const expectedResultFromLocation = [
  {
    courtId: 34,
    name: 'Aylesbury Crown Court',
    jurisdiction: 'Crown Court',
    location: 'Aylesbury',
    hearings: 8,
  },
  {
    courtId: 32,
    name: 'Aylesbury Magistrate\'s Court',
    jurisdiction: 'Magistrates Court',
    location: 'Aylesbury',
    hearings: 6,
  }];

describe('Input filter service', () => {
  it('should return filtered list with 1 match', () => {
    expect(inputService.findCourts(validSearchInputName, validCheckAgainst)).to.deep.equal(expectedResultFromName, 'Result did not match expected');
  });

  it('should return filtered list with 1 check against', () => {
    expect(inputService.findCourts(validSearchInputName, ['name'])).to.deep.equal(expectedResultFromName, 'Result did not match expected');
  });

  it('should return filtered list with 2 matches', () => {
    expect(inputService.findCourts(validSearchInputLocation, validCheckAgainst)).to.deep.equal(expectedResultFromLocation, 'Result did not match expected');
  });

  it('should return filtered list with matches', () => {
    expect(inputService.findCourts(validSearchInputJurisdiction, validCheckAgainst).length).equal(31, 'Results length did not match expected');
  });

  it('should return empty array for empty search input', () => {
    expect(inputService.findCourts(invalidSearchInputEmpty, validCheckAgainst).length).equal(0, 'No results should be returned');
  });

  it('should return empty array for undefined search input', () => {
    expect(inputService.findCourts(invalidSearchInputUndefined, validCheckAgainst).length).equal(0, 'No results should be returned');
  });

  it('should still find matches regardless of case', () => {
    expect(inputService.findCourts('aYleSbUrY', validCheckAgainst)).to.deep.equal(expectedResultFromLocation, 'Result did not match expected');
  });

  it('should alphabetise an unsorted array', () => {
    const unsorted = [
      {
        courtId: 34,
        name: 'Zenon Court',
        jurisdiction: 'Crown Court',
        location: 'Aylesbury',
        hearings: 8,
      },
      {
        courtId: 32,
        name: 'Aylesbury Magistrate\'s Court',
        jurisdiction: 'Magistrates Court',
        location: 'Aylesbury',
        hearings: 6,
      }];
    expect(inputService.alphabetiseResults(unsorted, 'name')[0]['name']).equal('Aylesbury Magistrate\'s Court', 'List was not sorted alphabetically correctly');
  });

  it('should numerically sort an unsorted array', () => {
    const unsorted = [
      {
        courtId: 34,
        name: 'Zenon Court',
        jurisdiction: 'Crown Court',
        location: 'Aylesbury',
        hearings: 8,
      },
      {
        courtId: 32,
        name: 'Aylesbury Magistrate\'s Court',
        jurisdiction: 'Crown Court',
        location: 'Aylesbury',
        hearings: 6,
      }];
    expect(inputService.numericallySortResults(unsorted, 'courtId')[0]['name']).equal('Aylesbury Magistrate\'s Court', 'List was not sorted numerically correctly');
  });


});
