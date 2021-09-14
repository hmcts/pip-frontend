import { CourtActions } from '../../../../main/resources/actions/courtActions';
import {PipApi} from '../../../../main/utils/PipApi';
import sinon from 'sinon';
import path from 'path';
import * as fs from 'fs';

const axios = require('axios');
jest.mock('axios');


const api = new PipApi(axios);



const courtActions = new CourtActions(api);
const validCourtId = 1;
const invalidCourtId = 1232;
const stubAllCourt = sinon.stub(api, 'getAllCourtList');
const rawData = fs.readFileSync(path.resolve(__dirname, '../../mocks/courtsAndHearingsCount.json'), 'utf-8');
const hearingsData = JSON.parse(rawData);
const stub = sinon.stub(api, 'getCourtDetails');
const rawData2 = fs.readFileSync(path.resolve(__dirname, '../../mocks/courtAndHearings.json'), 'utf-8');
const hearingsData2 = JSON.parse(rawData2);

describe('getCourtsList()', () => {



  stubAllCourt.withArgs().returns(hearingsData);

  it('should return list of 583 courts', () => {
    return courtActions.getCourtsList().then(data => {
      expect(data).toBe(hearingsData);
    });
  });

});

describe(`getCourtDetails(${validCourtId})`, function () {


  stub.withArgs(validCourtId).returns(hearingsData2);

  it('should return list of 1 court', () => {
    return courtActions.getCourtDetails(validCourtId).then(data => {
      expect(data).toBe(hearingsData2);
    });
  });

  it('should return court object with id ${validCourtId}', () => {
    return courtActions.getCourtDetails(validCourtId).then(data => {
      expect(data.courtId).toBe(validCourtId);
    });
  });

  it('should have attribute name with value Abergavenny Magistrates\' Court', () => {
    return courtActions.getCourtDetails(validCourtId).then(data => {
      expect(data.name).toBe('Abergavenny Magistrates\' Court');
    });
  });

  it('should have 2 hearings', () => {
    return courtActions.getCourtDetails(validCourtId).then(data => {
      expect(data.hearingList.length).toBe(3);
    });
  });

});

describe(`getCourtDetails(${invalidCourtId})`, function () {


  stub.withArgs(invalidCourtId).returns(null);

  it('should return null as court with id ${invalidCourtId} doesn\'t exist', () => {
    return courtActions.getCourtDetails(invalidCourtId).then(data => {
      expect(data).toBe(null);
    });
  });

});


