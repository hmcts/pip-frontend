import sinon from 'sinon';
import {dataManagementApi} from '../../../main/resources/requests/utils/axiosConfig';
import {StatusDescriptionRequests} from '../../../main/resources/requests/statusDescriptionRequests';
import fs from 'fs';
import path from 'path';

const statusDescriptionRequests = new StatusDescriptionRequests();

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/StatusDescription.json'), 'utf-8');
const statusDescriptionData = JSON.parse(rawData);

const stubGetStatusDescriptionList = sinon.stub(dataManagementApi, 'get');

describe('getStatusDescriptionList()', () => {

  it('should return list of 49 courts events status', () => {
    stubGetStatusDescriptionList.withArgs('/glossary').resolves({data: statusDescriptionData});
    return statusDescriptionRequests.getStatusDescriptionList().then(data => {
      expect(data.length).toBe(49);
    });
  });

  it('should return null if request fails', async () => {
    stubGetStatusDescriptionList.withArgs('/glossary').resolves(Promise.reject({response:{data: 'test error'}}));
    expect(await statusDescriptionRequests.getStatusDescriptionList()).toHaveLength(0);
  });

  it('should return null if request fails', async () => {
    stubGetStatusDescriptionList.withArgs('/glossary').resolves(Promise.reject({request:'test error'}));
    expect(await statusDescriptionRequests.getStatusDescriptionList()).toHaveLength(0);
  });

  it('should return null if request fails', async () => {
    stubGetStatusDescriptionList.withArgs('/glossary').resolves(Promise.reject({message:'test error'}));
    expect(await statusDescriptionRequests.getStatusDescriptionList()).toHaveLength(0);
  });


  it('First glossary should be Adjourned', () => {
    stubGetStatusDescriptionList.withArgs('/glossary').resolves({data: statusDescriptionData});
    return statusDescriptionRequests.getStatusDescriptionList().then(data => {
      expect(data[0].eventName).toEqual('Adjourned');
    });
  });

  it('Description fof First glossary must not be empty', () => {
    stubGetStatusDescriptionList.withArgs('/glossary').resolves({data: statusDescriptionData});
    return statusDescriptionRequests.getStatusDescriptionList().then(data => {
      expect(data[0].eventStatus).not.toBeNull();
    });
  });

  let i = 0;
  it('All Glossary items must have name and description', () => {
    stubGetStatusDescriptionList.withArgs('/courteventglossary').resolves({data: statusDescriptionData});
    return statusDescriptionRequests.getStatusDescriptionList().then(data => {
      expect(data[i].eventName).not.toBeNull();
      expect(data[i].eventStatus).not.toBeNull();
      i++;
    });
  });

});
