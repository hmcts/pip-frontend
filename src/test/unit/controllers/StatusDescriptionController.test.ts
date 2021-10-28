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

sinon.stub(StatusDescriptionService.prototype, 'getStatusDescriptionList').returns(statusDescriptionData);

describe('Status Description Controller', () => {
  it('should render the status description page', () =>  {
    const i18n = {
      'status-description': {},
    };

    const response = {
      render: function() {return '';},
    } as unknown as Response;
    const request = mockRequest(i18n);

    const responseMock = sinon.mock(response);

    const expectedData = {
      ...i18n['status-description'],
      courtList: statusDescriptionData,
    };

    responseMock.expects('render').once().withArgs('status-description', expectedData);

    return statusDescriptionController.get(request, response).then(() => {
      responseMock.verify();
    });
  });

});
