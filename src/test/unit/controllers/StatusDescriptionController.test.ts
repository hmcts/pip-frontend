import sinon from 'sinon';
import { Request, Response } from 'express';
import StatusDescriptionController from '../../../main/controllers/StatusDescriptionController';
import {PipApi} from '../../../main/utils/PipApi';
import fs from 'fs';
import path from 'path';
const axios = require('axios');
jest.mock('axios');

const api = new PipApi(axios);
const stub = sinon.stub(api, 'getStatusDescriptionList');
const rawData = fs.readFileSync(path.resolve(__dirname, '../../../main/resources/mocks/StatusDescription.json'), 'utf-8');
const statusDescriptionData = JSON.parse(rawData);

describe('Status Description Controller', () => {
  it('should render the status description page', () =>  {
    const statusDescriptionController = new StatusDescriptionController(api);

    stub.withArgs().returns(statusDescriptionData.results);

    const response = {
      render: function() {return '';},
      get: function() {return '';},
    } as unknown as Response;
    const request = {query: {}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('status-description');

    return statusDescriptionController.get(request, response).then(() => {
      responseMock.verify();
    });
  });

});
