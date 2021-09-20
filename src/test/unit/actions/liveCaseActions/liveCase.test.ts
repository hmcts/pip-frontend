import { expect } from 'chai';
import { LiveCasesActions } from '../../../../main/resources/actions/liveCaseActions';

const mockData = {
  courtId: 34,
  courtName: 'Aylesbury Crown Court',
  lastUpdated: '1631795400',
  courtUpdates: [
    {
      courtRoom: 1,
      caseNumber: 'T20218022',
      caseName: 'Hilpert, Bartoletti and Lehner',
      event: {
        eventId: 44,
        eventStatus: 'Respondent Case Closed',
        eventName: 'Evidence Presented',
        eventTime: '09:27',
      },
    },
    {
      courtRoom: 2,
      caseNumber: '',
      caseName: '',
      event: {
        eventId: 0,
        eventStatus: '',
        eventName: '',
        eventTime: '',
      },
    },
    {
      courtRoom: 3,
      caseNumber: 'T20218023',
      caseName: 'Ward-Kunde\'s',
      event: {
        eventId: 1,
        eventStatus: 'Verdict',
        eventName: 'Verdict Reached',
        eventTime: '10:23',
      },
    },
    {
      courtRoom: 4,
      caseNumber: 'T20218024',
      caseName: 'Stamm-Tromp',
      event: {
        eventId: 2,
        eventStatus: 'Witness Evidence Concluded',
        eventName: 'Witness Finished Giving Evidence',
        eventTime: '10:56',
      },
    },
  ],
};
const validCourtId = 34;
const invalidCourtId = 777;

const liveCaseActions = new LiveCasesActions();

describe(`getLiveCases(${validCourtId})`, () => {
  const courtCases = liveCaseActions.getLiveCases(validCourtId);

  it(`should return hearings only for court ${validCourtId}`, () => {
    expect(courtCases.courtId).to.equal(validCourtId);
  });

  it('should return valid court hearings object', () => {
    expect(courtCases).to.deep.equal(mockData);
  });
});

describe(`getLiveCases(${invalidCourtId}`, () => {
  const courtCases = liveCaseActions.getLiveCases(invalidCourtId);

  it(`should return null as court with id ${invalidCourtId} doesn't exist`, () => {
    expect(courtCases).to.equal(null, `Expected null, got ${courtCases}`);
  });
});
