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

  it('should return list of publications', async () => {
    const pubReq = await pubRequests.getListOfPubs(0);
    expect(pubReq.length).toBe(totalCases);
  });

  it('should contain a publication', async () => {
    const pubReq = await pubRequests.getListOfPubs(0);
    expect(pubReq.some(e => e.provenance === 'NOT_A_PDF')).toBeTruthy();
  });

});
