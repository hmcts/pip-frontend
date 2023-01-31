import sinon from 'sinon';
import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import SessionLoggedOutController from '../../../main/controllers/SessionLoggedOutController';

const sessionLoggedOutController = new SessionLoggedOutController();
const i18n = {
    'session-logged-out': {},
};

describe('Session Expiring Controller', () => {
    it('should render session expiring page', () => {
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const responseMock = sinon.mock(response);
        const request = mockRequest(i18n);

        responseMock.expects('render').once().withArgs('session-logged-out', i18n['session-logged-out']);
        sessionLoggedOutController.get(request, response);
        responseMock.verify();
    });
});
