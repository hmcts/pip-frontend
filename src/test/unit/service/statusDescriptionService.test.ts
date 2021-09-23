import { StatusDescriptionService } from '../../../main/service/statusDescriptionService';
import { expect } from 'chai';

const statusDescriptionService = new StatusDescriptionService();
const statusDescriptionArray = statusDescriptionService.generateStatusDescriptionObject();
const validStatusDescriptionKeysCount = 26;
const alphabet = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
];
const validStatusDescription = 'Adjourned';
const invalidStatusDescription = 'Bench continue hearing';

describe('Status Description Service', () => {
  it(`should return object with ${validStatusDescriptionKeysCount} status description keys`, () => {
    expect(Object.keys(statusDescriptionArray).length).to.equal(validStatusDescriptionKeysCount);
  });

  it('should have have all letters of the alphabet as keys', () => {
    expect(Object.keys(statusDescriptionArray)).to.deep.equal(alphabet);
  });

  it(`should have ${validStatusDescription} key`, () => {
    expect(validStatusDescription in statusDescriptionArray['A']).to.be.true;
  });

  it('should not have invalid status', () => {
    expect(invalidStatusDescription in statusDescriptionArray['B']).to.be.false;
  });
});
