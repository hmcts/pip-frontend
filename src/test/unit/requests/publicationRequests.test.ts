import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import {dataManagementApi} from '../../../main/resources/requests/utils/axiosConfig';
import {PublicationRequests} from '../../../main/resources/requests/publicationRequests';

const rawDataPubs = fs.readFileSync(path.resolve(__dirname, '../../../test/unit/mocks/summaryOfPublications.json'), 'utf-8');
const pubs = JSON.parse(rawDataPubs);
const totalCases = 3;

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/dailyCauseList.json'), 'utf-8');
const dailyCauseListData = JSON.parse(rawData);

const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../mocks/dailyCauseListMetaData.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData);

const stub = sinon.stub(dataManagementApi, 'get');

const artefactId = 'abc';

const successResponse = {
  data: 'success',
};
const errorRequest = {
  request: 'test error',
};
const errorResponse = {
  response: {
    data: 'test error',
  },
};
const errorMessage = {
  message: 'test',
};

const valid = 'valid';
const invalid = 'invalid';

const publicationRequests = new PublicationRequests();

stub.withArgs('/publication/courtId/valid').resolves(successResponse);

stub.withArgs('/publication/abc1/payload').resolves(Promise.reject(errorResponse));
stub.withArgs('/publication/abc2/payload').resolves(Promise.reject(errorRequest));
stub.withArgs('/publication/abc3/payload').resolves(Promise.reject(errorMessage));
stub.withArgs('/publication/'+ artefactId + '/payload').resolves({data: dailyCauseListData});

stub.withArgs('/publication/abc1').resolves(Promise.reject(errorResponse));
stub.withArgs('/publication/abc2').resolves(Promise.reject(errorRequest));
stub.withArgs('/publication/abc3').resolves(Promise.reject(errorMessage));
stub.withArgs('/publication/'+ artefactId).resolves({data: metaData});

describe('getIndividualPubJson()', () => {

  it('should return publication json', async () => {
    expect(await publicationRequests.getIndividualPubJson(artefactId, true)).toBe(dailyCauseListData);
  });

  it('should return court PRESTON', async () => {
    return await publicationRequests.getIndividualPubJson(artefactId, true).then(data => {
      expect(data['venue']['venueName']).toEqual('PRESTON');
    });
  });

  it('should return judge title Mr', async () => {
    return await publicationRequests.getIndividualPubJson(artefactId, true).then(data => {
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['judiciary'][0]['johTitle']).toEqual('Mr');
    });
  });

  it('should have two hearings', async () => {
    return await publicationRequests.getIndividualPubJson(artefactId, true).then(data => {
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'].length).toEqual(2);
    });
  });

  it('should return empty list if request fails', async () => {
    expect(await publicationRequests.getIndividualPubJson('abc1', true)).toBe(null);
  });

  it('should return empty list if request fails', async () => {
    expect(await publicationRequests.getIndividualPubJson('abc2', true)).toBe(null);
  });

  it('should return empty list if message error', async () => {
    expect(await publicationRequests.getIndividualPubJson('abc3', true)).toBe(null);
  });
});

describe('getIndividualPubMetadata()', () => {

  it('should return publication meta data', async () => {
    expect(await publicationRequests.getIndividualPubMetadata(artefactId, true)).toBe(metaData);
  });

  it('should return content datetime', async () => {
    return await publicationRequests.getIndividualPubMetadata(artefactId, true).then(data => {
      expect(data['contentDate']).toEqual('2022-02-04T11:01:20.734Z');
    });
  });

  it('should return empty list if request fails', async () => {
    expect(await publicationRequests.getIndividualPubMetadata('abc1', true)).toBe(null);
  });

  it('should return empty list if request fails', async () => {
    expect(await publicationRequests.getIndividualPubMetadata('abc2', true)).toBe(null);
  });

  it('should return empty list if message error', async () => {
    expect(await publicationRequests.getIndividualPubMetadata('abc3', true)).toBe(null);
  });
});

describe('Get by case value', () => {
  stub.withArgs('/publication/search/valid/valid').resolves(successResponse);
  stub.withArgs('/publication/search/valid/invalid').resolves(Promise.reject(errorResponse));
  stub.withArgs('/publication/search/invalid/valid').resolves(Promise.reject(errorRequest));
  stub.withArgs('/publication/search/invalid/invalid').resolves(Promise.reject(errorMessage));

  it('should return data on successful get', async () => {
    expect(await publicationRequests.getPublicationByCaseValue(valid, valid, true)).toBe(successResponse.data);
  });

  it('should handle error response from returned service returning empty array', async () => {
    expect(await publicationRequests.getPublicationByCaseValue(valid, invalid, true)).toStrictEqual([]);
  });

  it('should handle error request from returned service returning empty array', async () => {
    expect(await publicationRequests.getPublicationByCaseValue(invalid, valid, true)).toStrictEqual([]);
  });

  it('should handle error request from returned service returning empty array', async () => {
    expect(await publicationRequests.getPublicationByCaseValue(invalid, invalid, true)).toStrictEqual([]);
  });
});

describe('Get publication by court id', () => {
  stub.withArgs('/publication/courtId/valid').resolves(successResponse);
  stub.withArgs('/publication/courtId/invalid').resolves(Promise.reject(errorResponse));
  stub.withArgs('/publication/courtId/test').resolves(Promise.reject(errorRequest));
  stub.withArgs('/publication/courtId/error').resolves(Promise.reject(errorMessage));

  it('should return data on successful get', async () => {
    expect(await publicationRequests.getPublicationsByCourt(valid, true)).toBe(successResponse.data);
  });

  it('should handle error response from returned service returning empty array', async () => {
    expect(await publicationRequests.getPublicationsByCourt(invalid, true)).toStrictEqual([]);
  });

  it('should handle error request from returned service returning empty array', async () => {
    expect(await publicationRequests.getPublicationsByCourt('test', true)).toStrictEqual([]);
  });

  it('should handle error request from returned service returning empty array', async () => {
    expect(await publicationRequests.getPublicationsByCourt('error', true)).toStrictEqual([]);
  });
});

describe('get Publication request', () => {
  stub.withArgs('/publication/search/0').resolves({data: pubs});
  it('should return list of publications if verified', async () => {
    const pubReq = await publicationRequests.getListOfPubs(0, true);
    expect(pubReq.length).toBe(totalCases);
  });

  it('should return list of publications if unverified', async () => {
    const pubReq = await publicationRequests.getListOfPubs(0, false);
    expect(pubReq.length).toBe(totalCases);
  });

  it('should contain a publication', async () => {
    const pubReq = await publicationRequests.getListOfPubs(0, true);
    expect(pubReq.some(e => e.provenance === 'NOT_A_PDF')).toBeTruthy();
  });

  it('should send an error request to the log if error request exists', async ()=> {
    stub.withArgs('/publication/search/x').resolves(Promise.reject(errorRequest));
    expect(await publicationRequests.getListOfPubs('x', true)).toBe(null);
  });

  it('should send an error to the log if error message exists and error request does not exist', async () => {
    stub.withArgs('/publication/search/y').resolves(Promise.reject(errorMessage));
    const message = await publicationRequests.getListOfPubs('y', true);
    expect(message).toBe(null);
  });

  it('should send an error to the log if error response exists', async () => {
    stub.withArgs('/publication/search/z').resolves(Promise.reject(errorResponse));
    const response = await publicationRequests.getListOfPubs('z', true);
    expect(response).toBe(null);
  });
});
