import sinon from 'sinon';
import { Request, Response } from 'express';
import StatusDescriptionController from '../../../main/controllers/StatusDescriptionController';

describe('Status Description Controller', () => {
  it('should render the status descroiption page', () =>  {
    const statusDescriptionController = new StatusDescriptionController();

    const response = {
      render: function() {return '';},
      get: function() {return '';},
      set: function() {return '';},
    } as unknown as Response;
    const request = {query: {}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('status-description');

    statusDescriptionController.get(request, response);

    responseMock.verify();
  });

});
