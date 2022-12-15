import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import sinon from 'sinon';
import UpdateUserConfirmationController from '../../../main/controllers/UpdateUserConfirmationController';
import {AccountManagementRequests} from '../../../main/resources/requests/accountManagementRequests';

const stub = sinon.stub(AccountManagementRequests.prototype, 'updateUser');
const validBody = {userId: '1234', updatedRole: 'SYSTEM_ADMIN'};
const invalidBody = {userId: '1', updatedRole: 'WRONG_ROLE'};
const updateUserConfirmationController = new UpdateUserConfirmationController();

describe('Update User Confirmation Controller', () => {
  beforeEach(() => {
    stub.withArgs('1234', 'SYSTEM_ADMIN').resolves(true);
    stub.withArgs('1', 'WRONG_ROLE').resolves(undefined);
  });

  const i18n = {
    'update-user-confirmation': {},
    error: {},
  };
  const response = { render: () => {return '';}, redirect: () => {return '';}} as unknown as Response;
  const request = mockRequest(i18n);

  it('should render update user confirmation page if valid body data is provided', () => {
    request.body = validBody;
    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('update-user-confirmation', {...i18n['update-user-confirmation'],
      updatedRole: 'System Admin', isSystemAdmin: false});

    return updateUserConfirmationController.post(request, response).then(() => {
      responseMock.verify();
    });
  });

  it('should render error page is update user call fails', () => {
    request.body = invalidBody;
    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('error', {...i18n.error});

    return updateUserConfirmationController.post(request, response).then(() => {
      responseMock.verify();
    });
  });
});
