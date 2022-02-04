import { PublicationRequests } from '../../../main/resources/requests/publicationRequests';
import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import {dataManagementApi} from '../../../main/resources/requests/utils/axiosConfig';

const rawDataPubs = fs.readFileSync(path.resolve(__dirname, '../../../test/unit/mocks/summaryOfPublications.json'), 'utf-8');
const pubs = JSON.parse(rawDataPubs);
const totalCases = 3;
const pubRequests = new PublicationRequests();
const stub = sinon.stub(dataManagementApi, 'get');

beforeEach(async () => {
  stub.withArgs('/publication/search/0').resolves({data: pubs});
});

describe('get Publication request', () => {
  const errorRequest = {
    request: 'test error',
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

  it('should send an error to the log if error', async ()=> {
    stub.withArgs('/publication/search/x').resolves(Promise.reject(errorRequest));
    expect(typeof(await pubRequests.getListOfPubs('x', true))).toBe('undefined');
  });

});
