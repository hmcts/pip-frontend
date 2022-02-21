import sinon from 'sinon';
import {dataManagementApi} from '../../../main/resources/requests/utils/axiosConfig';
import {PublicationRequests} from '../../../main/resources/requests/publicationRequests';
import fs from 'fs';
import path from 'path';

const publicationRequests = new PublicationRequests();

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/dailyCauseList.json'), 'utf-8');
const dailyCauseListData = JSON.parse(rawData);

const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../mocks/dailyCauseListMetaData.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData);

const stub = sinon.stub(dataManagementApi, 'get');

const artefactId = 'abc';

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
