import {Response} from 'express';
import sinon from 'sinon';
import {mockRequest} from '../mocks/mockRequest';
import CancelledPasswordResetController from '../../../main/controllers/CancelledPasswordResetController';

const cancelledPasswordResetController = new CancelledPasswordResetController();

describe('Cancelled password reset controller', () => {
  const response = { render: () => {return '';}} as unknown as Response;
  const request = mockRequest({'cancelled-password-reset': {}});
  const i18n = {'cancelled-password-reset': {}};

  it('should render cancelled password reset controller for admin', async () => {
    request['params']['isAdmin'] = 'true';

    const responseMock = sinon.mock(response);

    const expectedData = {
      ...i18n['cancelled-password-reset'],
      isAdmin: true,
    };

    responseMock.expects('render').once().withArgs('cancelled-password-reset', expectedData);

    await cancelledPasswordResetController.get(request, response);
    await responseMock.verify();

  });

  it('should render cancelled password reset controller for non admin', async () => {
    request['params']['isAdmin'] = 'false';

    const responseMock = sinon.mock(response);

    const expectedData = {
      ...i18n['cancelled-password-reset'],
      isAdmin: false,
    };

    responseMock.expects('render').once().withArgs('cancelled-password-reset', expectedData);

    await cancelledPasswordResetController.get(request, response);
    await responseMock.verify();
  });

});
