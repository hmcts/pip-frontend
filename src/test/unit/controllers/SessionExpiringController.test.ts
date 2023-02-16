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
    it('should render session expiring page', () => {
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const responseMock = sinon.mock(response);
        const request = mockRequest(i18n);
        request.query = { currentPath: expectedPath };

        const expectedOptions = {
            ...i18n['session-expiring'],
            gotoPage: expectedPath,
        };

        responseMock.expects('render').once().withArgs('session-expiring', expectedOptions);
        sessionExpiringController.get(request, response);
        responseMock.verify();
    });
});
