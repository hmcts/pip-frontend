import sinon from 'sinon';
import {Response} from 'express';
import {mockRequest} from '../mocks/mockRequest';
import SessionExpiredController from '../../../main/controllers/SessionExpiredController';
import {SessionManagementService} from '../../../main/service/sessionManagementService';

const sessionExpiredController = new SessionExpiredController();
const i18n =  {
  'session-expired': {},
};
const mediaSignInUrl = '/login?p=B2C_1_SignInUserFlow';
const adminSignInUrl = '/admin-login?p=B2C_1_SignInAdminUserFlow';

sinon.stub(SessionManagementService.prototype, 'logOut');

describe('Session Expired Controller', () => {
  it('should render session expired page for media user', () => {
    const response = { render: () => {return '';}} as unknown as Response;
    const responseMock = sinon.mock(response);
    const request = mockRequest(i18n);
    request.query = {admin: 'false'};

    const expectedOptions = {
      ...i18n['session-expired'],
      signInUrl: mediaSignInUrl,
    };

    responseMock.expects('render').once().withArgs('session-expired', expectedOptions);
    sessionExpiredController.get(request, response);
    responseMock.verify();
  });

  it('should render session expired page for admin user', () => {
    const response = { render: () => {return '';}} as unknown as Response;
    const responseMock = sinon.mock(response);
    const request = mockRequest(i18n);
    request.query = {admin: 'true'};

    const expectedOptions = {
      ...i18n['session-expired'],
      signInUrl: adminSignInUrl,
    };

    responseMock.expects('render').once().withArgs('session-expired', expectedOptions);
    sessionExpiredController.get(request, response);
    responseMock.verify();
  });
});
