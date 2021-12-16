import { mockRequest } from '../mocks/mockRequest';
import { Response } from 'express';
import AccountHomeController from '../../../main/controllers/AccountHomeController';
import sinon from 'sinon';

const accountHomeController = new AccountHomeController();

describe('Account home controller', () => {
  it('should render account home page', () => {
    const response = { render: () => {return '';}} as unknown as Response;
    const request = mockRequest({'account-home': {}});
    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('account-home', request.i18n.getDataByLanguage(request.lng)['account-home']);
    accountHomeController.get(request, response);
    responseMock.verify();
  });
});
