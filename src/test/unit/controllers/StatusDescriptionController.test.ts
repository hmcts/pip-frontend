import sinon from 'sinon';
import { Response } from 'express';
import StatusDescriptionController from '../../../main/controllers/StatusDescriptionController';
import fs from 'fs';
import path from 'path';
import {StatusDescriptionService} from '../../../main/service/statusDescriptionService';
import {mockRequest} from '../mocks/mockRequest';


const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/courtAndHearings.json'), 'utf-8');
const statusDescriptionData = JSON.parse(rawData);
const statusDescriptionController = new StatusDescriptionController();

const stub = sinon.stub(StatusDescriptionService.prototype, 'generateStatusDescriptionObject').returns(statusDescriptionData);

describe('Status Description Controller', () => {
  it('should render the status description page', () =>  {
    const i18n = {
      'status-description': {},
    };

    stub.withArgs(1).returns(statusDescriptionData);

    const response = { render: function() {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    request.query = {courtId: '1'};

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('status-description');

    return statusDescriptionController.get(request, response).then(() => {
      responseMock.verify();
    });
  });

});
