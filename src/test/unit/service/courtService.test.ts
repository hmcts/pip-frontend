import { CourtService } from '../../../main/service/courtService';
import { expect } from 'chai';

const courtService = new CourtService();
const crownCourtsArray = courtService.generateCrownCourtArray();
const validKeysCount = 26;
const alphabet = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
];
const validCourt = 'Aylesbury Crown Court';
const invalidCourt = 'Birmingham Magistrate\'s Court';

describe('Court Service', () => {
  it(`should return object with ${validKeysCount} keys`, () => {
    expect(Object.keys(crownCourtsArray).length).to.equal(validKeysCount);
  });

  it('should have have all letters of the alphabet as keys', () => {
    expect(Object.keys(crownCourtsArray)).to.deep.equal(alphabet);
  });

  it(`should have ${validCourt} key`, () => {
    expect(validCourt in crownCourtsArray['A']).to.be.true;
  });

  it('should not have magistrate court', () => {
    expect(invalidCourt in crownCourtsArray['B']).to.be.false;
  });
});
