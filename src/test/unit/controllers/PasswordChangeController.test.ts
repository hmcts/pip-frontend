import { mockRequest } from '../mocks/mockRequest';
import { Response } from 'express';
import sinon from 'sinon';
import PasswordChangeController from '../../../main/controllers/PasswordChangeController';

const passwordChangeController = new PasswordChangeController();

describe('Password Change Confirmation controller', () => {
  it('should render password-change-confirmation', async () => {
    const response = { render: () => {return '';}} as unknown as Response;
    const request = mockRequest({'password-change-confirmation': {}});
    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('password-change-confirmation', request.i18n.getDataByLanguage(request.lng)['password-change-confirmation']);
    await passwordChangeController.get(request, response);
    await responseMock.verify();
  });
});
