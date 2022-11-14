import sinon from 'sinon';
import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import SessionExpiredController from '../../../main/controllers/SessionExpiredController';
import { SessionManagementService } from '../../../main/service/sessionManagementService';

const sessionExpiredController = new SessionExpiredController();
const i18n = {
  'session-expired': {},
};
const mediaSignInUrl = 'sign-in';
const adminSignInUrl = 'admin-dashboard';

sinon.stub(SessionManagementService.prototype, 'logOut');

describe('Session Expired Controller', () => {
  it('should render session expired page for media user', () => {
    const response = {
      render: () => {
        return '';
      },
    } as unknown as Response;
    const responseMock = sinon.mock(response);
    const request = mockRequest(i18n);
    request.query = { reSignInUrl: mediaSignInUrl };

    const expectedOptions = {
      ...i18n['session-expired'],
      signInUrl: mediaSignInUrl,
    };

    responseMock.expects('render').once().withArgs('session-expired', expectedOptions);
    sessionExpiredController.get(request, response);
    responseMock.verify();
  });

  it('should render session expired page for admin user', () => {
    const response = {
      render: () => {
        return '';
      },
    } as unknown as Response;
    const responseMock = sinon.mock(response);
    const request = mockRequest(i18n);
    request.query = { reSignInUrl: adminSignInUrl };

    const expectedOptions = {
      ...i18n['session-expired'],
      signInUrl: adminSignInUrl,
    };

    responseMock.expects('render').once().withArgs('session-expired', expectedOptions);
    sessionExpiredController.get(request, response);
    responseMock.verify();
  });
});
