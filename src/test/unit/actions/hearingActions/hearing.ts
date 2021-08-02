import { HearingActions } from '../../../../main/resources/actions/hearingActions';

const mockData = {
  hearingId: 5,
  courtId: 9,
  courtNumber: 1,
  date: '1/9/2021',
  time: '8:29 AM',
  judge: 'Judge Brigida Francioli',
  platform: 'Microsoft Teams',
  caseNumber: '74-363-1243',
  caseName: "Hansen-Trantow's Hearing",
};
const validCourtId = 9;
const invalidCourtId = 232;
const validHearingId = 5;
const invalidHearingId = 999;

const hearingActions = new HearingActions();

describe(`getCourtHearings(${validCourtId})`, () => {
  const courtHearings = hearingActions.getCourtHearings(validCourtId);

  it('should return list of 2 hearings', () => {
    expect(courtHearings.length).toBe(2);
  });

  it('should have mocked object in the hearings list', () => {
    expect(courtHearings.filter((hearings) => hearings.caseNumber === mockData.caseNumber).length).toBe(1);
  });

  it(`should have only hearings for court id ${validCourtId}`, () => {
    expect(courtHearings.filter((hearings) => hearings.courtId === validCourtId).length).toBe(courtHearings.length);
  });
});

describe(`getCourtHearings(${invalidCourtId})`, function () {
  const courtHearings = hearingActions.getCourtHearings(invalidCourtId);

  it(`should return empty list as court with id ${invalidCourtId}`, () => {
    expect(courtHearings.length).toBe(0);
  });
});

describe(`getHearingDetails(${validHearingId})`, function () {
  const courtHearings = hearingActions.getHearingDetails(validHearingId);

  it(`should return an object with hearing id ${validHearingId}`, () => {
    expect(courtHearings.hearingId).toBe(validHearingId);
  });

  it('response should match mocked object', () => {
    expect(courtHearings).toStrictEqual(mockData);
  });
});

describe(`getHearingDetails(${invalidHearingId})`, function () {
  const courtHearings = hearingActions.getHearingDetails(invalidHearingId);

  it(`should return null as hearing with id ${invalidHearingId} doesn't exist`, () => {
    expect(courtHearings).toBe(null);
  });
});
