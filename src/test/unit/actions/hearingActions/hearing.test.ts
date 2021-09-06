import { HearingActions } from '../../../../main/resources/actions/hearingActions';
import {PipApi} from "../../../../main/utils/PipApi";
import fs from "fs";
import path from "path";
import sinon from 'sinon';


const axios = require('axios');
jest.mock('axios');


const api = new PipApi(axios);

const validCourtId = 9;
const invalidCourtId = 1232;
const validHearingId = 5;
const invalidHearingId = 2000;

const hearingActions = new HearingActions(api);
const stub = sinon.stub(api, 'getHearingList');
const rawData = fs.readFileSync(path.resolve(__dirname, '../../mocks/hearingsListByCourt.json'), 'utf-8');
const hearingsData = JSON.parse(rawData);

describe(`getCourtHearings(${validCourtId})`, () => {

  stub.withArgs(validCourtId).returns(hearingsData);


  it('should return list of hearings', () => {
    return hearingActions.getCourtHearings(validCourtId).then(data => {
      expect(data).toBe(hearingsData);
    });
  });

  it('should return list of 1000 hearings', () => {
    return hearingActions.getCourtHearings(validCourtId).then(data => {
      expect(data.length).toBe(4);
    });
  });


  it('should have mocked object in the hearings list', () => {
    return hearingActions.getCourtHearings(validCourtId).then(data => {
      expect(data.filter((hearings) => hearings.caseNumber === data[0].caseNumber).length).toBe(1);
    });
  });

  it(`should have only hearings for court id ${validCourtId}`, () => {
    return hearingActions.getCourtHearings(validCourtId).then(data => {
      expect(data.filter((hearings) => hearings.courtId === validCourtId).length).toBe(data.length);
    });
  });
});

describe(`getCourtHearings(${invalidCourtId})`, () => {

  stub.withArgs(invalidCourtId).returns({});


  it('should return empty list as court with id ${invalidCourtId}', () => {
    return hearingActions.getCourtHearings(invalidCourtId).then(data => {
      expect(data).toStrictEqual({});
    });
  });

});

describe(`getHearingDetails(${validHearingId})`, function () {

  stub.withArgs(validCourtId).returns(hearingsData);

  it('response should match mocked object', () => {
    return hearingActions.getCourtHearings(validCourtId).then(data => {
      expect(data).toBe(hearingsData);
    });
  });
});

describe(`getHearingDetails(${invalidHearingId})`, function () {

  stub.withArgs(validCourtId).returns(hearingsData);

  it(`should return null as hearing with id ${invalidHearingId} doesn't exist`, () => {
    return hearingActions.getCourtHearings(invalidCourtId).then(data => {
      expect(data).toStrictEqual({});
    });
  });
});
