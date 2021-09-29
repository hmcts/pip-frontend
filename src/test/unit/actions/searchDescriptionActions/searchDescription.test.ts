import { SearchDescriptionActions } from '../../../../main/resources/actions/searchDescriptionActions';
import {PipApi} from '../../../../main/utils/PipApi';
import sinon from 'sinon';
import fs from 'fs';
import path from 'path';

const axios = require('axios');
jest.mock('axios');

const api = new PipApi(axios);

const searchDescriptionActions = new SearchDescriptionActions(api);

const stubGetStatusDescriptionList = sinon.stub(api, 'getStatusDescriptionList');
const rawData = fs.readFileSync(path.resolve(__dirname, '../../../../main/resources/mocks/StatusDescription.json'), 'utf-8');
const statusDescriptionData = JSON.parse(rawData);

describe('getStatusDescriptionList()', () => {
  stubGetStatusDescriptionList.withArgs().returns(statusDescriptionData.results);

  it('should return list of 49 courts events status', () => {
    return searchDescriptionActions.getStatusDescriptionList().then(data => {
      expect(data.length).toBe(49);
    });
  });
});

describe('First glossary should be Adjourned', () => {

  stubGetStatusDescriptionList.withArgs().returns(statusDescriptionData.results);

  it('First glossary should be Adjourned', () => {
    return searchDescriptionActions.getStatusDescriptionList().then(data => {
      expect(data[0].name).toEqual('Adjourned');
    });
  });
});

describe('Description fof First glossary must not be empty', () => {
  stubGetStatusDescriptionList.withArgs().returns(statusDescriptionData.results);

  it('Description fof First glossary must not be empty', () => {
    return searchDescriptionActions.getStatusDescriptionList().then(data => {
      expect(data[0].description).not.toBeNull();
    });
  });
});

describe('All Glossary items must have name and description', () => {
  stubGetStatusDescriptionList.withArgs().returns(statusDescriptionData.results);
  let i = 0;
  it('All Glossary items must have name and description', () => {
    return searchDescriptionActions.getStatusDescriptionList().then(data => {
      expect(data[i].name).not.toBeNull();
      expect(data[i].description).not.toBeNull();
      i++;
    });
  });
});
