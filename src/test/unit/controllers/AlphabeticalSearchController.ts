import sinon from 'sinon';
import { Request, Response } from 'express';
import AlphabeticalSearchController from '../../../main/controllers/AlphabeticalSearchController';
import {PipApi} from '../../../main/utils/PipApi';
import fs from 'fs';
import path from 'path';
const axios = require('axios');
jest.mock('axios');


const api = new PipApi(axios);
const stub = sinon.stub(api, 'getAllCourtList');
const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/courtsAndHearingsCount.json'), 'utf-8');
const hearingsData = JSON.parse(rawData);
describe('Alphabetical Search Controller', () => {
  it('should render the alphabetical search page', () =>  {
    const alphabeticalSearchController = new AlphabeticalSearchController(api);

    stub.withArgs().returns(hearingsData);

    const response = {
      render: function() {return '';},
      get: function() {return 'abcd abcd;script-src abcd';},
      set: function() {return '';},
    } as unknown as Response;
    const request = {query: {}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('alphabetical-search');

    return alphabeticalSearchController.get(request, response).then(() => {
      responseMock.verify();
    });

  });

});
