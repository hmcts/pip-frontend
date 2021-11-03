import sinon from 'sinon';
import {dataManagementApi} from '../../../main/resources/requests/utils/axiosConfig';
import {CourtRequests} from '../../../main/resources/requests/courtRequests';
import fs from 'fs';
import path from 'path';

const courtRequests = new CourtRequests();

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/courtAndHearings.json'), 'utf-8');
const courtList = JSON.parse(rawData);

const errorResponse = {
  response: {
    data: 'test error',
  },
};

const errorRequest = {
  request: 'test error',
};

const courtNameSearch = 'Abergavenny Magistrates\' Court';

const stub = sinon.stub(dataManagementApi, 'get');

const filters = ['location', 'jurisdiction'];
const values = ['london', 'Crown Court'];
const test = ['test'];

describe('Court get requests', () => {

  beforeEach(() => {
    stub.withArgs('/courts/1').resolves({data: courtList[0]});
    stub.withArgs('/courts/2').resolves(Promise.reject(errorResponse));
    stub.withArgs('/courts/3').resolves(Promise.reject(errorRequest));

    stub.withArgs(`/courts/find/${courtNameSearch}`).resolves({data: courtList[0]});
    stub.withArgs('/courts/find/test').resolves(Promise.reject(errorResponse));
    stub.withArgs('/courts/find/testReq').resolves(Promise.reject(errorRequest));

    stub.withArgs('/courts/filter', {data: {filters: filters, values: values}}).resolves({data: courtList});
    stub.withArgs('/courts/filter', {data: {filters: test, values: test}}).resolves(Promise.reject(errorResponse));

    stub.withArgs('/courts').resolves({data: courtList});
  });

  it('should return court by court id', async () => {
    expect(await courtRequests.getCourt(1)).toBe(courtList[0]);
  });

  it('should return null if request fails', async () => {
    expect(await courtRequests.getCourt(2)).toBe(null);
  });

  it('should return null if request fails', async () => {
    expect(await courtRequests.getCourt(3)).toBe(null);
  });

  it('should return court by name', async () => {
    expect(await courtRequests.getCourtByName(courtNameSearch)).toBe(courtList[0]);
  });

  it('should return null if request fails', async () => {
    expect(await courtRequests.getCourtByName('test')).toBe(null);
  });

  it('should return null if request fails', async () => {
    expect(await courtRequests.getCourtByName('testReq')).toBe(null);
  });

  it('should return list of courts based on search filter', async () => {
    expect(await courtRequests.getFilteredCourts(filters, values)).toBe(courtList);
  });

  it('should return null if request fails', async () => {
    expect(await courtRequests.getFilteredCourts(test, test)).toBe(null);
  });

  it('should return null if filter request fails', async () => {
    expect(await courtRequests.getFilteredCourts([], [])).toBe(null);
  });

  it('should return list of courts', async () => {
    expect(await courtRequests.getAllCourts()).toBe(courtList);
  });

  it('should return null list of courts', async () => {
    stub.withArgs('/courts').resolves(Promise.reject(errorResponse));
    expect(await courtRequests.getFilteredCourts(test, test)).toBe(null);
  });

  it('should return null list of courts', async () => {
    stub.withArgs('/courts').resolves(Promise.reject(errorRequest));
    expect(await courtRequests.getAllCourts()).toBe(null);
  });
});
