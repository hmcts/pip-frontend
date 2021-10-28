import sinon from 'sinon';
import {dataManagementApi} from '../../../main/resources/requests/utils/axiosConfig';
import {SearchDescriptionRequests} from '../../../main/resources/requests/searchDescriptionRequests';
import fs from 'fs';
import path from 'path';

const searchDescriptionRequests = new SearchDescriptionRequests();

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/StatusDescription.json'), 'utf-8');
const statusDescriptionData = JSON.parse(rawData);

const stubGetStatusDescriptionList = sinon.stub(dataManagementApi, 'get');

describe('getStatusDescriptionList()', () => {

  it('should return list of 49 courts events status', () => {
    stubGetStatusDescriptionList.withArgs('/courts/getCourtEventStatus').resolves({data: statusDescriptionData});
    return searchDescriptionRequests.getStatusDescriptionList().then(data => {
      expect(data.length).toBe(49);
    });
  });

  it('should return null if request fails', async () => {
    stubGetStatusDescriptionList.withArgs('/courts/getCourtEventStatus').resolves(Promise.reject({response:{data: 'test error'}}));
    expect(await searchDescriptionRequests.getStatusDescriptionList()).toBe(null);
  });

  it('First glossary should be Adjourned', () => {
    stubGetStatusDescriptionList.withArgs('/courts/getCourtEventStatus').resolves({data: statusDescriptionData});
    return searchDescriptionRequests.getStatusDescriptionList().then(data => {
      expect(data[0].eventName).toEqual('Adjourned');
    });
  });

  it('Description fof First glossary must not be empty', () => {
    stubGetStatusDescriptionList.withArgs('/courts/getCourtEventStatus').resolves({data: statusDescriptionData});
    return searchDescriptionRequests.getStatusDescriptionList().then(data => {
      expect(data[0].eventStatus).not.toBeNull();
    });
  });

  let i = 0;
  it('All Glossary items must have name and description', () => {
    stubGetStatusDescriptionList.withArgs('/courts/getCourtEventStatus').resolves({data: statusDescriptionData});
    return searchDescriptionRequests.getStatusDescriptionList().then(data => {
      expect(data[i].eventName).not.toBeNull();
      expect(data[i].eventStatus).not.toBeNull();
      i++;
    });
  });

});
