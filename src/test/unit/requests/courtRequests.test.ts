import sinon from 'sinon';
import {dataManagementApi} from '../../../main/resources/requests/utils/axiosConfig';
import {CourtRequests} from '../../../main/resources/requests/courtRequests';
import fs from 'fs';
import path from 'path';

const courtRequests = new CourtRequests();
const { redisClient } = require('../../../main/cacheManager');
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

const errorMessage = {
  message: 'test',
};

const courtNameSearch = 'Abergavenny Magistrates\' Court';

const stub = sinon.stub(dataManagementApi, 'get');
sinon.stub(redisClient, 'status').value('ready');
const stubCacheGet = sinon.stub(redisClient, 'get');
sinon.stub(redisClient, 'set').withArgs('court-4').returns(JSON.stringify(courtList[0]));

const regions = 'london';
const jurisdictions = 'Crown Court';
const test = 'test';

describe('Court get requests', () => {

  beforeEach(() => {
    stub.withArgs('/courts/1').resolves({data: courtList[0]});
    stub.withArgs('/courts/2').resolves(Promise.reject(errorResponse));
    stub.withArgs('/courts/3').resolves(Promise.reject(errorRequest));
    stub.withArgs('/courts/4').resolves(Promise.reject(errorMessage));
    stub.withArgs('/courts/5').resolves({data: courtList[4]});

    stub.withArgs(`/courts/name/${courtNameSearch}`).resolves({data: courtList[0]});
    stub.withArgs('/courts/name/test').resolves(Promise.reject(errorResponse));
    stub.withArgs('/courts/name/testReq').resolves(Promise.reject(errorRequest));
    stub.withArgs('/courts/name/testMes').resolves(Promise.reject(errorMessage));

    stub.withArgs('/courts/filter', {params: {regions: regions, jurisdictions: jurisdictions}}).resolves({data: courtList});
    stub.withArgs('/courts/filter', {params: {regions: test, jurisdictions: test}}).resolves(Promise.reject(errorResponse));
    stub.withArgs('/courts/filter', {params: {regions: test, jurisdictions: 'error'}}).resolves(Promise.reject(errorMessage));
    stub.withArgs('/courts/filter', {params: {regions: test, jurisdictions: 'foo'}}).resolves(Promise.reject(errorRequest));

    stub.withArgs('/courts').resolves({data: courtList});
  });

  it('should return court by court id from cache', async () => {
    stubCacheGet.withArgs('court-1').resolves(JSON.stringify(courtList[0]));
    expect(await courtRequests.getCourt(1)).toStrictEqual(courtList[0]);
  });

  it('should return court by court id without cache', async () => {
    stub.withArgs('court-1').resolves(null);
    expect(await courtRequests.getCourt(1)).toStrictEqual(courtList[0]);
  });

  it('should set court in the cache after response returns data', async () => {
    expect(await courtRequests.getCourt(5)).toStrictEqual(courtList[4]);
  });

  it('should return null if response fails ', async () => {
    expect(await courtRequests.getCourt(2)).toBe(null);
  });

  it('should return null if request fails', async () => {
    expect(await courtRequests.getCourt(3)).toBe(null);
  });

  it('should return null if call fails', async () => {
    expect(await courtRequests.getCourt(4)).toBe(null);
  });

  it('should return court by name', async () => {
    expect(await courtRequests.getCourtByName(courtNameSearch)).toBe(courtList[0]);
  });

  it('should return null if response fails', async () => {
    expect(await courtRequests.getCourtByName('test')).toBe(null);
  });

  it('should return null if request fails', async () => {
    expect(await courtRequests.getCourtByName('testReq')).toBe(null);
  });

  it('should return null if call fails', async () => {
    expect(await courtRequests.getCourtByName('testMes')).toBe(null);
  });

  it('should return list of courts based on search filter', async () => {
    expect(await courtRequests.getFilteredCourts(regions, jurisdictions)).toBe(courtList);
  });

  it('should return null if request fails', async () => {
    expect(await courtRequests.getFilteredCourts(test, test)).toBe(null);
  });

  it('should return null if response fails', async () => {
    expect(await courtRequests.getFilteredCourts(test, 'error')).toBe(null);
  });

  it('should return list of courts', async () => {
    expect(await courtRequests.getAllCourts()).toBe(courtList);
  });

  it('should return list of courts if cache is set', async () => {
    stubCacheGet.withArgs('allCourts').resolves(JSON.stringify(courtList));
    expect(await courtRequests.getAllCourts()).toStrictEqual(courtList);
  });

  it('should return null list of courts for error response', async () => {
    stub.withArgs('/courts').resolves(Promise.reject(errorResponse));
    expect(await courtRequests.getFilteredCourts(test, test)).toBe(null);
  });

  it('should return null list of courts for error request', async () => {
    stub.withArgs('/courts').resolves(Promise.reject(errorRequest));
    expect(await courtRequests.getFilteredCourts(test, 'foo')).toBe(null);
  });

  it('should return null list of courts for error request', async () => {
    stub.withArgs('/courts').resolves(Promise.reject(errorRequest));
    stubCacheGet.withArgs('allCourts').resolves(null);
    expect(await courtRequests.getAllCourts()).toBe(null);
  });

  it('should return null list of courts for errored call', async () => {
    stub.withArgs('/courts').resolves(Promise.reject(errorMessage));
    stubCacheGet.withArgs('allCourts').resolves(null);
    expect(await courtRequests.getAllCourts()).toBe(null);
  });

  it('should return null list of courts for errored response', async () => {
    stub.withArgs('/courts').resolves(Promise.reject(errorResponse));
    stubCacheGet.withArgs('allCourts').resolves(null);
    expect(await courtRequests.getAllCourts()).toBe(null);
  });
});
