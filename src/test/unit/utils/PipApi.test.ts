import sinon from 'sinon';
import {PipApi} from '../../../main/utils/PipApi';
import fs from 'fs';
import path from 'path';
const axios = require('axios');
jest.mock('axios');


const api = new PipApi(axios);
const stubGetCourtDetails = sinon.stub(api, 'getCourtDetails');
const stubGetCourtList = sinon.stub(api, 'getCourtList');
const stubGetAllCourtList = sinon.stub(api, 'getAllCourtList');
const stubGetHearingList = sinon.stub(api, 'getHearingList');

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/courtAndHearings.json'), 'utf-8');
const hearingsData = JSON.parse(rawData);

const rawData2 = fs.readFileSync(path.resolve(__dirname, '../mocks/courtAndHearings.json'), 'utf-8');
const hearingsData2 = JSON.parse(rawData2);
describe('PipApi utils', () => {
  it('should return court for passed court id', () =>  {
    stubGetCourtDetails.withArgs(1).returns(hearingsData);

    const data = api.getCourtDetails(1);

    expect(data).toBe(hearingsData);
  });

  it('should return court list for passed input search', () =>  {
    stubGetCourtList.withArgs('court name').returns(hearingsData2);

    const data = api.getCourtList('court name');

    expect(data).toBe(hearingsData2);
  });

  it('should return all court list', () =>  {
    stubGetAllCourtList.withArgs().returns(hearingsData2);

    const data = api.getAllCourtList();

    expect(data).toBe(hearingsData2);
  });

  it('should return court for passed court id', () =>  {
    stubGetHearingList.withArgs(1).returns(hearingsData);

    const data = api.getHearingList(1);

    expect(data).toBe(hearingsData);
  });

});
