import sinon from 'sinon';
import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import SessionExpiringController from '../../../main/controllers/SessionExpiringController';

const sessionExpiringController = new SessionExpiringController();
const i18n = {
    'session-expiring': {},
};
const expectedPath = '/view-option';

describe('Session Expiring Controller', () => {
    it('should render session expiring page when user is Admin', () => {
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const responseMock = sinon.mock(response);
        const request = mockRequest(i18n);
        request['user'] = { userProvenance: 'PI_AAD', roles: 'INTERNAL_SUPER_ADMIN_CTSC' };
        request.query = { currentPath: expectedPath };

        const expectedOptions = {
            ...i18n['session-expiring'],
            gotoPage: expectedPath,
            redirectPage: 'ADMIN',
        };

        responseMock.expects('render').once().withArgs('session-expiring', expectedOptions);
        sessionExpiringController.get(request, response);
        responseMock.verify();
    });

    it('should render session expiring page when user is Verified', () => {
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const responseMock = sinon.mock(response);
        const request = mockRequest(i18n);
        request['user'] = { userProvenance: 'PI_AAD', roles: 'VERIFIED' };
        request.query = { currentPath: expectedPath };

        const expectedOptions = {
            ...i18n['session-expiring'],
            gotoPage: expectedPath,
            redirectPage: 'AAD',
        };

        responseMock.expects('render').once().withArgs('session-expiring', expectedOptions);
        sessionExpiringController.get(request, response);
        responseMock.verify();
    });

    it('should render session expiring page when user is CFT', () => {
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const responseMock = sinon.mock(response);
        const request = mockRequest(i18n);
        request['user'] = { userProvenance: 'CFT', roles: 'VERIFIED' };
        request.query = { currentPath: expectedPath };

        const expectedOptions = {
            ...i18n['session-expiring'],
            gotoPage: expectedPath,
            redirectPage: 'CFT',
        };

        responseMock.expects('render').once().withArgs('session-expiring', expectedOptions);
        sessionExpiringController.get(request, response);
        responseMock.verify();
    });

    it('should render session expiring page when user is Crime', () => {
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const responseMock = sinon.mock(response);
        const request = mockRequest(i18n);
        request['user'] = { userProvenance: 'CRIME_IDAM', roles: 'VERIFIED' };
        request.query = { currentPath: expectedPath };

        const expectedOptions = {
            ...i18n['session-expiring'],
            gotoPage: expectedPath,
            redirectPage: 'CRIME',
        };

        responseMock.expects('render').once().withArgs('session-expiring', expectedOptions);
        sessionExpiringController.get(request, response);
        responseMock.verify();
    });

    it('should render session expiring page for SSO user', () => {
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const responseMock = sinon.mock(response);
        const request = mockRequest(i18n);
        request['user'] = { userProvenance: 'SSO', roles: 'SYSTEM_ADMIN' };
        request.query = { currentPath: expectedPath };

        const expectedOptions = {
            ...i18n['session-expiring'],
            gotoPage: expectedPath,
            redirectPage: 'SSO',
        };

        responseMock.expects('render').once().withArgs('session-expiring', expectedOptions);
        sessionExpiringController.get(request, response);
        responseMock.verify();
    });
});
