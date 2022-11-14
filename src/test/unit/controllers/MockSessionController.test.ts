import sinon from 'sinon';

import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import MockSessionController from '../../../main/controllers/MockSessionController';

const mockSessionController = new MockSessionController();

describe.skip('Mock Session Controller', () => {
  const i18n = {
    'session-management': {},
  };

  it('should render mock session page without user data', () => {
    const response = {
      render: () => {
        return '';
      },
    } as unknown as Response;
    const request = mockRequest(i18n);
    request.user = undefined;

    const expectedData = {
      ...i18n['session-management'],
      haveUser: false,
    };

    const responseMock = sinon.mock(response);
    responseMock.expects('render').once().withArgs('session-management', expectedData);

    mockSessionController.get(request, response);
    responseMock.verify();
  });

  it('should render mock session page with user data', () => {
    const response = {
      render: () => {
        return '';
      },
    } as unknown as Response;
    const request = mockRequest(i18n);
    const mockUser = {
      id: '1',
      username: '',
      userType: 'media',
    };
    request.user = mockUser;

    const expectedData = {
      ...i18n['session-management'],
      haveUser: true,
      userDetails: mockUser,
    };

    const responseMock = sinon.mock(response);
    responseMock.expects('render').once().withArgs('session-management', expectedData);

    mockSessionController.get(request, response);
    responseMock.verify();
  });
});
