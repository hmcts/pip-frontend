import { CourtActions } from '../../../../main/resources/actions/courtActions';

const courtActions = new CourtActions();
const validCourtId = 10;
const invalidCourtId = 232;

describe('getCourtsList()', () => {
  const results = courtActions.getCourtsList();

  it('should return list of 100 courts', () => {
    expect(results.length).toBe(100);
  });
});

describe(`getCourtDetails(${validCourtId})`, function () {
  const courtDetails = courtActions.getCourtDetails(validCourtId);

  it(`should return court object with id ${validCourtId}`, () => {
    expect(courtDetails.courtId).toBe(validCourtId);
  });

  it('should have attribute name with value Polzela Court', () => {
    expect(courtDetails.name).toBe('Polzela Court');
  });

  it('should have 2 hearings', () => {
    expect(courtDetails.hearings).toBe(2);
  });
});

describe(`getCourtDetails(${invalidCourtId})`, function () {
  const courtDetails = courtActions.getCourtDetails(invalidCourtId);

  it(`should return null as court with id ${invalidCourtId} doesn't exist`, () => {
    expect(courtDetails).toBe(null);
  });
});

