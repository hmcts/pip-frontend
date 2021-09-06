import {InputFilterService} from '../../../main/service/inputFilterService';
import {expect} from 'chai';
import fs from "fs";
import path from "path";

const inputService = new InputFilterService();

const validSearchInputName = 'Accrington Magistrates\' Court';
const validSearchInputLocation = 'London';
const validSearchInputJurisdiction = 'Crown Court';
const validCheckAgainst = ['name', 'location', 'jurisdiction'];

const invalidSearchInputEmpty = '';
const invalidSearchInputUndefined = undefined;

const expectedResultFromName = [{
  'courtId': 3,
  'name': 'Accrington Magistrates\' Court',
  'jurisdiction': 'Crown Court',
  'location': 'Manchester'
}];

const expectedResultFromLocation = [
  {
    'courtId': 2,
    'name': 'Accrington County Court',
    'jurisdiction': 'Crown Court',
    'location': 'London'
  },
  {
    'courtId': 6,
    'name': 'Alton Magistrates\' Court',
    'jurisdiction': 'Royal Court',
    'location': 'London'
  },

];

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/courtsAllReduced.json'), 'utf-8');
const courtsData = JSON.parse(rawData);

describe('Input filter service', () => {
  it('should return filtered list with 1 match', () => {
    expect(inputService
      .findCourts(validSearchInputName, validCheckAgainst, courtsData))
      .to.deep.equal(expectedResultFromName, 'Result did not match expected');
  });

  it('should return filtered list with 1 check against', () => {
    expect(inputService
      .findCourts(validSearchInputName, ['name'], courtsData))
      .to.deep.equal(expectedResultFromName, 'Result did not match expected');
  });

  it('should return filtered list with 2 matches', () => {
    expect(inputService
      .findCourts(validSearchInputLocation, validCheckAgainst, courtsData))
      .to.deep.equal(expectedResultFromLocation, 'Result did not match expected');
  });

  it('should return filtered list with matches', () => {
    expect(inputService
      .findCourts(validSearchInputJurisdiction, validCheckAgainst, courtsData).length)
      .equal(5, 'Results length did not match expected');
  });

  it('should return empty array for empty search input', () => {
    expect(inputService
      .findCourts(invalidSearchInputEmpty, validCheckAgainst, courtsData).length)
      .equal(0, 'No results should be returned');
  });

  it('should return empty array for undefined search input', () => {
    expect(inputService
      .findCourts(invalidSearchInputUndefined, validCheckAgainst, courtsData).length)
      .equal(0, 'No results should be returned');
  });

  it('should still find matches regardless of case', () => {
    expect(inputService
      .findCourts('lOnDoN', validCheckAgainst, courtsData))
      .to.deep.equal(expectedResultFromLocation, 'Result did not match expected');
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
        jurisdiction: 'Crown Court',
        location: 'Aylesbury',
        hearings: 6,
      }];
    expect(inputService
      .alphabetiseResults(unsorted, 'name')[0]['name'])
      .equal('Aylesbury Magistrate\'s Court', 'List was not sorted alphabetically correctly');
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
    expect(inputService
      .numericallySortResults(unsorted, 'courtId')[0]['name'])
      .equal('Aylesbury Magistrate\'s Court', 'List was not sorted numerically correctly');
  });


});
