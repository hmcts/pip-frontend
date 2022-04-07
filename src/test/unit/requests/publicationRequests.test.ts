import {PublicationRequests} from '../../../main/resources/requests/publicationRequests';
import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import {dataManagementApi} from '../../../main/resources/requests/utils/axiosConfig';

const Blob = require('node-blob');
const rawDataPubs = fs.readFileSync(path.resolve(__dirname, '../../../test/unit/mocks/summaryOfPublications.json'), 'utf-8');
const pubs = JSON.parse(rawDataPubs);
const totalCases = 3;
const pubRequests = new PublicationRequests();
const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/dailyCauseList.json'), 'utf-8');
const dailyCauseListData = JSON.parse(rawData);
const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];
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
const mockJson = {'data': {'hello': 'hello'}};
const mockPDF = new Blob(['testPDF']);
const indivPubJsonObject = {'data': mockPDF};
const valid = 'valid';
const invalid = 'invalid';
const dataManagementStub = sinon.stub(dataManagementApi, 'get');
const dataMngmntDeleteStub = sinon.stub(dataManagementApi, 'delete');
dataManagementStub.withArgs('/publication/courtId/valid').resolves(successResponse);

const publicationRequests = new PublicationRequests();

dataManagementStub.withArgs('/publication/courtId/valid').resolves(successResponse);

dataManagementStub.withArgs('/publication/abc1/payload').resolves(Promise.reject(errorResponse));
dataManagementStub.withArgs('/publication/abc2/payload').resolves(Promise.reject(errorRequest));
dataManagementStub.withArgs('/publication/abc3/payload').resolves(Promise.reject(errorMessage));
dataManagementStub.withArgs('/publication/' + artefactId + '/payload').resolves({data: dailyCauseListData});

dataManagementStub.withArgs('/publication/abc1').resolves(Promise.reject(errorResponse));
dataManagementStub.withArgs('/publication/abc2').resolves(Promise.reject(errorRequest));
dataManagementStub.withArgs('/publication/abc3').resolves(Promise.reject(errorMessage));
dataManagementStub.withArgs('/publication/' + artefactId).resolves({data: metaData});

dataMngmntDeleteStub.withArgs('/publication/abc1').resolves(Promise.reject(errorResponse));
dataMngmntDeleteStub.withArgs('/publication/abc2').resolves(Promise.reject(errorRequest));
dataMngmntDeleteStub.withArgs('/publication/abc3').resolves(Promise.reject(errorMessage));
dataMngmntDeleteStub.withArgs('/publication/abc').resolves(true);

describe('getIndividualPubJson()', () => {

  it('should return publication json', async () => {
    expect(await publicationRequests.getIndividualPublicationJson(artefactId, true)).toBe(dailyCauseListData);
  });

  it('should return court PRESTON', async () => {
    return await publicationRequests.getIndividualPublicationJson(artefactId, true).then(data => {
      expect(data['venue']['venueName']).toEqual('PRESTON');
    });
  });

  it('should return judge title Mr', async () => {
    return await publicationRequests.getIndividualPublicationJson(artefactId, true).then(data => {
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['judiciary'][0]['johTitle']).toEqual('Mr');
    });
  });

  it('should have two hearings', async () => {
    return await publicationRequests.getIndividualPublicationJson(artefactId, true).then(data => {
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'].length).toEqual(2);
    });
  });

  it('should return empty list if request fails', async () => {
    expect(await publicationRequests.getIndividualPublicationJson('abc1', true)).toBe(null);
  });

  it('should return empty list if request fails', async () => {
    expect(await publicationRequests.getIndividualPublicationJson('abc2', true)).toBe(null);
  });

  it('should return empty list if message error', async () => {
    expect(await publicationRequests.getIndividualPublicationJson('abc3', true)).toBe(null);
  });
});

describe('getIndividualPubMetadata()', () => {

  it('should return publication meta data', async () => {
    expect(await publicationRequests.getIndividualPublicationMetadata(artefactId, true, false)).toBe(metaData);
  });

  it('should return content datetime', async () => {
    return await publicationRequests.getIndividualPublicationMetadata(artefactId, true, false).then(data => {
      expect(data['contentDate']).toEqual('2022-02-14T14:14:59.73967');
    });
  });

  it('should return empty list if request fails', async () => {
    expect(await publicationRequests.getIndividualPublicationMetadata('abc1', true, false)).toBe(null);
  });

  it('should return empty list if request fails', async () => {
    expect(await publicationRequests.getIndividualPublicationMetadata('abc2', true, false)).toBe(null);
  });

  it('should return empty list if message error', async () => {
    expect(await publicationRequests.getIndividualPublicationMetadata('abc3', true, false)).toBe(null);
  });
});

describe('Get by case value', () => {
  dataManagementStub.withArgs('/publication/search/valid/valid').resolves(successResponse);
  dataManagementStub.withArgs('/publication/search/valid/invalid').resolves(Promise.reject(errorResponse));
  dataManagementStub.withArgs('/publication/search/invalid/valid').resolves(Promise.reject(errorRequest));
  dataManagementStub.withArgs('/publication/search/invalid/invalid').resolves(Promise.reject(errorMessage));

  it('should return data on successful get', async () => {
    expect(await pubRequests.getPublicationByCaseValue(valid, valid, true)).toBe(successResponse.data);
  });

  it('should handle error response from returned service returning empty array', async () => {
    expect(await pubRequests.getPublicationByCaseValue(valid, invalid, true)).toStrictEqual([]);
  });

  it('should handle error request from returned service returning empty array', async () => {
    expect(await pubRequests.getPublicationByCaseValue(invalid, valid, true)).toStrictEqual([]);
  });

  it('should handle error request from returned service returning empty array', async () => {
    expect(await pubRequests.getPublicationByCaseValue(invalid, invalid, true)).toStrictEqual([]);
  });
});

describe('Get publication by court id', () => {
  dataManagementStub.withArgs('/publication/courtId/valid').resolves(successResponse);
  dataManagementStub.withArgs('/publication/courtId/invalid').resolves(Promise.reject(errorResponse));
  dataManagementStub.withArgs('/publication/courtId/test').resolves(Promise.reject(errorRequest));
  dataManagementStub.withArgs('/publication/courtId/error').resolves(Promise.reject(errorMessage));

  it('should return data on successful get', async () => {
    expect(await pubRequests.getPublicationsByCourt(valid, true, false)).toBe(successResponse.data);
  });

  it('should handle error response from returned service returning empty array', async () => {
    expect(await pubRequests.getPublicationsByCourt(invalid, true, false)).toStrictEqual([]);
  });

  it('should handle error request from returned service returning empty array', async () => {
    expect(await pubRequests.getPublicationsByCourt('test', true, false)).toStrictEqual([]);
  });

  it('should handle error request from returned service returning empty array', async () => {
    expect(await pubRequests.getPublicationsByCourt('error', true, false)).toStrictEqual([]);
  });
});

describe('get individual publication metadata', () => {
  it('should return metadata for a given publication', async () => {
    dataManagementStub.withArgs('/publication/fakeArtefactId').resolves({data: pubs});
    const message = await pubRequests.getIndividualPublicationMetadata('fakeArtefactId', true, false);
    expect(message.length).toBe(totalCases);
  });

  it('should send an error request to the log if error request exists', async () => {
    dataManagementStub.withArgs('/publication/promiseBreakingData').resolves(Promise.reject(errorRequest));
    expect(await pubRequests.getIndividualPublicationMetadata('promiseBreakingData', true, false)).toBe(null);
  });

  it('should send an error to the log if error response exists', async () => {
    dataManagementStub.withArgs('/publication/brokenPromiseWithErrorResponse').resolves(Promise.reject(errorResponse));
    const response = await pubRequests.getIndividualPublicationMetadata('brokenPromiseWithErrorResponse', true, false);
    expect(response).toBe(null);
  });

  it('should send an error to the log if error message exists and error request does not exist', async () => {
    dataManagementStub.withArgs('/publication/noErrRequest').resolves(Promise.reject(errorMessage));
    const message = await pubRequests.getIndividualPublicationMetadata('noErrRequest', true, false);
    expect(message).toBe(null);
  });

  describe('get individual publication file', () => {
    it('should return file for a given publication', async () => {
      dataManagementStub.withArgs('/publication/fakeArtefactId/file', {
        headers: {'verification': 'true'},
        responseType: 'arraybuffer'}).resolves(indivPubJsonObject);
      const message = await pubRequests.getIndividualPublicationFile('fakeArtefactId', true);
      expect(message).toBe(indivPubJsonObject.data);
    });

    it('should send an error request to the log if error request exists', async () => {
      dataManagementStub.withArgs('/publication/promiseBreakingData/file').resolves(Promise.reject(errorRequest));
      expect(await pubRequests.getIndividualPublicationFile('promiseBreakingData', true)).toBe(null);
    });

    it('should send an error to the log if error response exists', async () => {
      dataManagementStub.withArgs('/publication/brokenPromiseWithErrorResponse/file').resolves(Promise.reject(errorResponse));
      const response = await pubRequests.getIndividualPublicationFile('brokenPromiseWithErrorResponse', true);
      expect(response).toBe(null);
    });

    it('should send an error to the log if error message exists and error request does not exist', async () => {
      dataManagementStub.withArgs('/publication/search/y').resolves(Promise.reject(errorMessage));
      const message = await publicationRequests.getPublicationsByCourt('y', true, false);
      expect(message).toStrictEqual([]);
    });
  });

  describe('get individual publication json', () => {
    it('should return json for a given publication', async () => {
      dataManagementStub.withArgs('/publication/fakeArtefactId/payload', {headers: {'verification': 'true'}}).resolves(mockJson);
      const message = await pubRequests.getIndividualPublicationJson('fakeArtefactId', true);
      expect(message).toBe(mockJson.data);
    });

    it('should send an error request to the log if error request exists', async () => {
      dataManagementStub.withArgs('/publication/promiseBreakingData/payload').resolves(Promise.reject(errorRequest));
      expect(await pubRequests.getIndividualPublicationJson('promiseBreakingData', true)).toBe(null);
    });

    it('should send an error to the log if error response exists', async () => {
      dataManagementStub.withArgs('/publication/brokenPromiseWithErrorResponse/payload').resolves(Promise.reject(errorResponse));
      const response = await pubRequests.getIndividualPublicationJson('brokenPromiseWithErrorResponse', true);
      expect(response).toBe(null);
    });

    it('should send an error to the log if error message exists and error request does not exist', async () => {
      dataManagementStub.withArgs('/publication/noErrRequest/payload').resolves(Promise.reject(errorMessage));
      const message = await pubRequests.getIndividualPublicationJson('y', true);
      expect(message).toBe(null);
    });
  });

  describe('delete publication', () => {
    it('should return true if valid data is provided', async () => {
      const response = await pubRequests.deletePublication('abc', 'joe@bloggs.com');
      expect(response).toBe(true);
    });

    it('should handle error response', async () => {
      expect(await pubRequests.deletePublication('abc1', 'joe@bloggs.com')).toBe(false);
    });

    it('should handle error request', async () => {
      expect(await pubRequests.deletePublication('abc2', 'joe@bloggs.com')).toBe(false);
    });

    it('should handle error message', async () => {
      expect(await pubRequests.deletePublication('abc3', 'joe@bloggs.com')).toBe(false);
    });
  });
});
