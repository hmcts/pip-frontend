import { PublicationRequests } from '../../../main/resources/requests/publicationRequests';
import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import {dataManagementApi} from '../../../main/resources/requests/utils/axiosConfig';
const Blob = require('node-blob');
const rawDataPubs = fs.readFileSync(path.resolve(__dirname, '../../../test/unit/mocks/summaryOfPublications.json'), 'utf-8');
const pubs = JSON.parse(rawDataPubs);
const totalCases = 3;
const pubRequests = new PublicationRequests();
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
const mockJson = {'data':{'hello':'hello'}};
const mockPDF = new Blob(['testPDF']);
const indivPubJsonObject = {'data':mockPDF};
const valid = 'valid';
const invalid = 'invalid';
const dataManagementStub = sinon.stub(dataManagementApi, 'get');
dataManagementStub.withArgs('/publication/courtId/valid').resolves(successResponse);
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
    expect(await pubRequests.getPublicationsByCourt(valid, true)).toBe(successResponse.data);
  });

  it('should handle error response from returned service returning empty array', async () => {
    expect(await pubRequests.getPublicationsByCourt(invalid, true)).toStrictEqual([]);
  });

  it('should handle error request from returned service returning empty array', async () => {
    expect(await pubRequests.getPublicationsByCourt('test', true)).toStrictEqual([]);
  });

  it('should handle error request from returned service returning empty array', async () => {
    expect(await pubRequests.getPublicationsByCourt('error', true)).toStrictEqual([]);
  });
});

describe('get individual publication metadata', () => {
  it('should return metadata for a given publication', async () => {
    dataManagementStub.withArgs('/publication/fakeArtefactId').resolves({data: pubs});
    const message = await pubRequests.getIndividualPublicationMetadata('fakeArtefactId', true);
    expect(message.length).toBe(totalCases);
  });

  it('should send an error request to the log if error request exists', async () => {
    dataManagementStub.withArgs('/publication/promiseBreakingData').resolves(Promise.reject(errorRequest));
    expect(await pubRequests.getIndividualPublicationMetadata('promiseBreakingData', true)).toBe(null);
  });

  it('should send an error to the log if error response exists', async () => {
    dataManagementStub.withArgs('/publication/brokenPromiseWithErrorResponse').resolves(Promise.reject(errorResponse));
    const response = await pubRequests.getIndividualPublicationMetadata('brokenPromiseWithErrorResponse', true);
    expect(response).toBe(null);
  });

  it('should send an error to the log if error message exists and error request does not exist', async () => {
    dataManagementStub.withArgs('/publication/noErrRequest').resolves(Promise.reject(errorMessage));
    const message = await pubRequests.getIndividualPublicationMetadata('noErrRequest', true);
    expect(message).toBe(null);
  });
});

describe('get individual publication file', () => {
  it('should return file for a given publication', async () => {
    dataManagementStub.withArgs('/publication/fakeArtefactId/file', {headers: {'verification': 'true'}, responseType: 'arraybuffer'}).resolves(indivPubJsonObject);
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
    dataManagementStub.withArgs('/publication/noErrRequest/file').resolves(Promise.reject(errorMessage));
    const message = await pubRequests.getIndividualPublicationFile('y', true);
    expect(message).toBe(null);
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
