import { mockRequest } from '../mocks/mockRequest';
import { Response } from 'express';
import sinon from 'sinon';
import PasswordChangeController from '../../../main/controllers/PasswordChangeController';

const passwordChangeController = new PasswordChangeController();

describe('Password Change Confirmation controller', () => {
  const response = { render: () => {return '';}} as unknown as Response;
  const request = mockRequest({'password-change-confirmation': {}});

  it('should render password-change-confirmation for an admin', async () => {
    request.path = '/password-change-confirmation/true';
    const responseMock = sinon.mock(response);

    const i18n = {
      'password-change-confirmation': {},
    };

    const expectedData = {
      ...i18n['password-change-confirmation'],
      isAdmin: true,
    };

    responseMock.expects('render').once().withArgs('password-change-confirmation', expectedData);

    await passwordChangeController.get(request, response);
    await responseMock.verify();
  });

  it('should render password-change-confirmation for a media user', async () => {
    request.path = '/password-change-confirmation/false';
    const responseMock = sinon.mock(response);

    const i18n = {
      'password-change-confirmation': {},
    };

    const expectedData = {
      ...i18n['password-change-confirmation'],
      isAdmin: false,
    };

    responseMock.expects('render').once().withArgs('password-change-confirmation', expectedData);

    await passwordChangeController.get(request, response);
    await responseMock.verify();
  });
});
