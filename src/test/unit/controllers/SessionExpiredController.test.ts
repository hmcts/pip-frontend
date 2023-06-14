import sinon from 'sinon';
import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import SessionExpiredController from '../../../main/controllers/SessionExpiredController';
import { SessionManagementService } from '../../../main/service/sessionManagementService';
import { reSignInUrls } from '../../../main/models/consts';

const sessionExpiredController = new SessionExpiredController();
const i18n = {
    'session-expired': {},
};

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
        request.query = { reSignInUrl: 'AAD' };

        const expectedOptions = {
            ...i18n['session-expired'],
            signInUrl: reSignInUrls.AAD,
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
        request.query = { reSignInUrl: 'ADMIN' };

        const expectedOptions = {
            ...i18n['session-expired'],
            signInUrl: reSignInUrls.ADMIN,
        };

        responseMock.expects('render').once().withArgs('session-expired', expectedOptions);
        sessionExpiredController.get(request, response);
        responseMock.verify();
    });

    it('should render session expired page for CFT IDAM user', () => {
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const responseMock = sinon.mock(response);
        const request = mockRequest(i18n);
        request.query = { reSignInUrl: 'CFT' };

        const expectedOptions = {
            ...i18n['session-expired'],
            signInUrl: reSignInUrls.CFT,
        };

        responseMock.expects('render').once().withArgs('session-expired', expectedOptions);
        sessionExpiredController.get(request, response);
        responseMock.verify();
    });

    it('should render error page when no re-direct url provided', () => {
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const responseMock = sinon.mock(response);
        const request = mockRequest(i18n);
        request.query = {};

        responseMock.expects('render').once().withArgs('error');
        sessionExpiredController.get(request, response);
        responseMock.verify();
    });

    it('should render error page when re-direct provided but not string', () => {
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const responseMock = sinon.mock(response);
        const request = mockRequest(i18n);
        request.query = { reSignInUrl: {} };

        responseMock.expects('render').once().withArgs('error');
        sessionExpiredController.get(request, response);
        responseMock.verify();
    });

    it('should render error page when re-direct provided but not of valid value', () => {
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const responseMock = sinon.mock(response);
        const request = mockRequest(i18n);
        request.query = { reSignInUrl: 'NOT-VALID' };

        responseMock.expects('render').once().withArgs('error');
        sessionExpiredController.get(request, response);
        responseMock.verify();
    });
});
