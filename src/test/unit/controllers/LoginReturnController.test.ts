import sinon from 'sinon';
import {Response} from 'express';
import {mockRequest} from '../mocks/mockRequest';
import LoginReturnController from '../../../main/controllers/LoginReturnController';

describe('Login Return Controller', () => {
  it('should render the login-return page', () =>  {
    const loginReturnController = new LoginReturnController();

    const i18n = {
      'login-return': {},
    };

    const response = { render: () => {return '';}} as unknown as Response;
    const request = mockRequest(i18n);

    const responseMock = sinon.mock(response);

    const expectedData = {
      ...i18n['login-return'],
    };

    responseMock.expects('render').once().withArgs('login-return', expectedData);

    loginReturnController.get(request, response);

    responseMock.verify();
  });

});
