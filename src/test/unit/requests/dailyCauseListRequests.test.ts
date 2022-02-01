import sinon from 'sinon';
import {dataManagementApi} from '../../../main/resources/requests/utils/axiosConfig';
import {DailyCauseListRequests} from '../../../main/resources/requests/dailyCauseListRequests';
import fs from 'fs';
import path from 'path';

const dailyCauseListRequests = new DailyCauseListRequests();

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/dailyCauseList.json'), 'utf-8');
const dailyCauseListData = JSON.parse(rawData);

const stub = sinon.stub(dataManagementApi, 'get');

const artefactId = '10b6e951-2746-4fab-acad-564dcac9c58d';
const errorRequest = {
  request: 'test error',
};

describe('getDailyCauseList()', () => {

  it('should return list of daily cause list', async () => {
    stub.withArgs('/publication/' + artefactId).resolves({data: dailyCauseListData});
    return await dailyCauseListRequests.getDailyCauseList(artefactId).then(data => {
      expect(data['courtLists'].length).toBe(1);
    });
  });

  it('should return null if request fails', async () => {
    stub.withArgs('/publication/' + artefactId).resolves(Promise.reject({response:{data: 'test error'}}));
    return await dailyCauseListRequests.getDailyCauseList(artefactId).then(data => {
      expect(data).toBe(null);
    });
  });

  it('should return court PRESTON', async () => {
    stub.withArgs('/publication/' + artefactId).resolves({data: dailyCauseListData});
    return await dailyCauseListRequests.getDailyCauseList(artefactId).then(data => {
      expect(data['venue']['venueName']).toEqual('PRESTON');
    });
  });

  it('should return judge title Mr', async () => {
    stub.withArgs('/publication/' + artefactId).resolves({data: dailyCauseListData});
    return await dailyCauseListRequests.getDailyCauseList(artefactId).then(data => {
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['judiciary'][0]['johTitle']).toEqual('Mr');
    });
  });

  it('should have two hearings', async () => {
    stub.withArgs('/publication/' + artefactId).resolves({data: dailyCauseListData});
    return await dailyCauseListRequests.getDailyCauseList(artefactId).then(data => {
      expect(data['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'].length).toEqual(2);
    });
  });

  it('should return null list of court event status', async () => {
    stub.withArgs('/publication/' + artefactId).resolves(Promise.reject(errorRequest));
    expect(await dailyCauseListRequests.getDailyCauseList(artefactId)).toEqual(null);
  });
});
