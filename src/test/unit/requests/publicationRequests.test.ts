import { PublicationRequests } from '../../../main/resources/requests/PublicationRequests';
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
const mockJson = {'data':{'hello':'hello'}};
const mockPDF = new Blob(['testPDF']);
const indivPubJsonObject = {'data':mockPDF};
const stub = sinon.stub(dataManagementApi, 'get');
stub.withArgs('/publication/search/0').resolves({data: pubs});
const errorMessage = {
  message: 'test',
};
const valid = 'valid';
const invalid = 'invalid';
const publicationRequests = new PublicationRequests();
const dataManagementStub = sinon.stub(dataManagementApi, 'get');
dataManagementStub.withArgs('/publication/courtId/valid').resolves(successResponse);

describe('Get by case value', () => {
  dataManagementStub.withArgs('/publication/search/valid/valid').resolves(successResponse);
  dataManagementStub.withArgs('/publication/search/valid/invalid').resolves(Promise.reject(errorResponse));
  dataManagementStub.withArgs('/publication/search/invalid/valid').resolves(Promise.reject(errorRequest));
  dataManagementStub.withArgs('/publication/search/invalid/invalid').resolves(Promise.reject(errorMessage));

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
  dataManagementStub.withArgs('/publication/courtId/valid').resolves(successResponse);
  dataManagementStub.withArgs('/publication/courtId/invalid').resolves(Promise.reject(errorResponse));
  dataManagementStub.withArgs('/publication/courtId/test').resolves(Promise.reject(errorRequest));
  dataManagementStub.withArgs('/publication/courtId/error').resolves(Promise.reject(errorMessage));

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
  dataManagementStub.withArgs('/publication/search/0').resolves({data: pubs});
  it('should return list of publications if verified', async () => {
    const pubReq = await pubRequests.getListOfPubs(0, true);
    expect(pubReq.length).toBe(totalCases);
  });

  it('should return list of publications if unverified', async () => {
    const pubReq = await pubRequests.getListOfPubs(0, false);
    expect(pubReq.length).toBe(totalCases);
  });

  it('should contain a publication', async () => {
    const pubReq = await pubRequests.getListOfPubs(0, true);
    expect(pubReq.some(e => e.provenance === 'NOT_A_PDF')).toBeTruthy();
  });

  it('should send an error request to the log if error request exists', async ()=> {
    dataManagementStub.withArgs('/publication/search/x').resolves(Promise.reject(errorRequest));
    expect(await pubRequests.getListOfPubs('x', true)).toBe(null);
  });

  it('should send an error to the log if error message exists and error request does not exist', async () => {
    dataManagementStub.withArgs('/publication/search/y').resolves(Promise.reject(errorMessage));
    const message = await pubRequests.getListOfPubs('y', true);
    expect(message).toBe(null);
  });

  it('should send an error to the log if error response exists', async () => {
    dataManagementStub.withArgs('/publication/search/z').resolves(Promise.reject(errorResponse));
    const response = await pubRequests.getListOfPubs('z', true);
    expect(response).toBe(null);
  });
});

describe('get individual publication metadata', () => {
  it('should return metadata for a given publication', async () => {
    stub.withArgs('/publication/fakeArtefactId').resolves({data: pubs});
    const message = await pubRequests.getIndividualPubMetadata('fakeArtefactId', true);
    expect(message.length).toBe(totalCases);
  });

  it('should send an error request to the log if error request exists', async () => {
    stub.withArgs('/publication/promiseBreakingData').resolves(Promise.reject(errorRequest));
    expect(await pubRequests.getIndividualPubMetadata('promiseBreakingData', true)).toBe(null);
  });

  it('should send an error to the log if error response exists', async () => {
    stub.withArgs('/publication/brokenPromiseWithErrorResponse').resolves(Promise.reject(errorResponse));
    const response = await pubRequests.getIndividualPubMetadata('brokenPromiseWithErrorResponse', true);
    expect(response).toBe(null);
  });

  it('should send an error to the log if error message exists and error request does not exist', async () => {
    stub.withArgs('/publication/noErrRequest').resolves(Promise.reject(errorMsg));
    const message = await pubRequests.getIndividualPubMetadata('noErrRequest', true);
    expect(message).toBe(null);
  });
});

describe('get individual publication file', () => {
  it('should return file for a given publication', async () => {
    stub.withArgs('/publication/fakeArtefactId/file', {headers: {'verification': 'true'}, responseType: 'arraybuffer'}).resolves(indivPubJsonObject);
    const message = await pubRequests.getIndividualPubFile('fakeArtefactId', true);
    expect(message).toBe(indivPubJsonObject.data);
  });

  it('should send an error request to the log if error request exists', async () => {
    stub.withArgs('/publication/promiseBreakingData/file').resolves(Promise.reject(errorRequest));
    expect(await pubRequests.getIndividualPubFile('promiseBreakingData', true)).toBe(null);
  });

  it('should send an error to the log if error response exists', async () => {
    stub.withArgs('/publication/brokenPromiseWithErrorResponse/file').resolves(Promise.reject(errorResponse));
    const response = await pubRequests.getIndividualPubFile('brokenPromiseWithErrorResponse', true);
    expect(response).toBe(null);
  });

  it('should send an error to the log if error message exists and error request does not exist', async () => {
    stub.withArgs('/publication/noErrRequest/file').resolves(Promise.reject(errorMsg));
    const message = await pubRequests.getIndividualPubFile('y', true);
    expect(message).toBe(null);
  });
});

describe('get individual publication json', () => {
  it('should return json for a given publication', async () => {
    stub.withArgs('/publication/fakeArtefactId/payload', {headers: {'verification': 'true'}}).resolves(mockJson);
    const message = await pubRequests.getIndividualPubJson('fakeArtefactId', true);
    expect(message).toBe(mockJson.data);
  });

  it('should send an error request to the log if error request exists', async () => {
    stub.withArgs('/publication/promiseBreakingData/payload').resolves(Promise.reject(errorRequest));
    expect(await pubRequests.getIndividualPubJson('promiseBreakingData', true)).toBe(null);
  });

  it('should send an error to the log if error response exists', async () => {
    stub.withArgs('/publication/brokenPromiseWithErrorResponse/payload').resolves(Promise.reject(errorResponse));
    const response = await pubRequests.getIndividualPubJson('brokenPromiseWithErrorResponse', true);
    expect(response).toBe(null);
  });

  it('should send an error to the log if error message exists and error request does not exist', async () => {
    stub.withArgs('/publication/noErrRequest/payload').resolves(Promise.reject(errorMsg));
    const message = await pubRequests.getIndividualPubJson('y', true);
    expect(message).toBe(null);
  });
});
