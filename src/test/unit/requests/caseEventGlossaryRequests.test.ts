import sinon from 'sinon';
import {dataManagementApi} from '../../../main/resources/requests/utils/axiosConfig';
import {CaseEventGlossaryRequests} from '../../../main/resources/requests/caseEventGlossaryRequests';
import fs from 'fs';
import path from 'path';

const searchDescriptionRequests = new CaseEventGlossaryRequests();

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/CaseEventGlossary.json'), 'utf-8');
const caseEventGlossaryData = JSON.parse(rawData);

const stub = sinon.stub(dataManagementApi, 'get');

const errorRequest = {
  request: 'test error',
};

describe('getCourtEventGlossaryList()', () => {

  it('should return list of 49 courts events status', () => {
    stub.withArgs('/glossary').resolves({data: caseEventGlossaryData});
    return searchDescriptionRequests.getCourtEventGlossaryList().then(data => {
      expect(data.length).toBe(49);
    });
  });

  it('should return null if request fails', async () => {
    stub.withArgs('/glossary').resolves(Promise.reject({response:{data: 'test error'}}));
    expect(await searchDescriptionRequests.getCourtEventGlossaryList()).toHaveLength(0);
  });

  it('First glossary should be Adjourned', () => {
    stub.withArgs('/glossary').resolves({data: caseEventGlossaryData});
    return searchDescriptionRequests.getCourtEventGlossaryList().then(data => {
      expect(data[0].name).toEqual('Adjourned');
    });
  });

  it('Description fof First glossary must not be empty', () => {
    stub.withArgs('/glossary').resolves({data: caseEventGlossaryData});
    return searchDescriptionRequests.getCourtEventGlossaryList().then(data => {
      expect(data[0].description).not.toBeNull();
    });
  });

  let i = 0;
  it('All Glossary items must have name and description', () => {
    stub.withArgs('/glossary').resolves({data: caseEventGlossaryData});
    return searchDescriptionRequests.getCourtEventGlossaryList().then(data => {
      expect(data[i].name).not.toBeNull();
      expect(data[i].description).not.toBeNull();
      i++;
    });
  });

  it('should return null list of court event status', async () => {
    stub.withArgs('/glossary').resolves(Promise.reject(errorRequest));
    expect(await searchDescriptionRequests.getCourtEventGlossaryList()).toStrictEqual([]);
  });

});
