import { SummaryOfPublicationsRequests } from '../../../main/resources/requests/summaryOfPublicationsRequests';
import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import {dataManagementApi} from '../../../main/resources/requests/utils/axiosConfig';

const rawDataPubs = fs.readFileSync(path.resolve(__dirname, '../../../test/unit/mocks/summaryOfPublications.json'), 'utf-8');
const pubs = JSON.parse(rawDataPubs);
const totalCases = 3;
const pubRequests = new SummaryOfPublicationsRequests();
const stub = sinon.stub(dataManagementApi, 'get');

beforeEach(async () => {
  stub.withArgs('/publication/search/0').resolves({data: pubs});
});

describe('get Publication request', () => {
  const errorRequest = {
    request: 'test error',
  };
  const errorMsg = {
    message: 'test error msg',
  };
  const errorResponse = {
    response: {
      data: 'test error',
    },
  };

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
    stub.withArgs('/publication/search/x').resolves(Promise.reject(errorRequest));
    expect(await pubRequests.getListOfPubs('x', true)).toBe(null);
  });

  it('should send an error to the log if error message exists and error request does not exist', async () => {
    stub.withArgs('/publication/search/y').resolves(Promise.reject(errorMsg));
    const message = await pubRequests.getListOfPubs('y', true);
    expect(message).toBe(null);
  });

  it('should send an error to the log if error response exists', async () => {
    stub.withArgs('/publication/search/z').resolves(Promise.reject(errorResponse));
    const response = await pubRequests.getListOfPubs('z', true);
    expect(response).toBe(null);
  });

});
