import { Response } from 'express';
import sinon from 'sinon';
import { mockRequest } from '../mocks/mockRequest';
import CancelledPasswordResetController from '../../../main/controllers/CancelledPasswordResetController';

const cancelledPasswordResetController = new CancelledPasswordResetController();

describe('Cancelled password reset controller', () => {
    const response = {
        render: () => {
            return '';
        },
    } as unknown as Response;

    const betaText = 'test beta text';
    const i18n = {
        'cancelled-password-reset': {},
        template: { betaHeadingAdmin: betaText },
    };
    const request = mockRequest(i18n);

    it('should render cancelled password reset controller for admin', async () => {
        request['params']['isAdmin'] = 'true';

        const responseMock = sinon.mock(response);

        const expectedData = {
            ...i18n['cancelled-password-reset'],
            betaText: betaText,
            isAdmin: true,
        };

        responseMock.expects('render').once().withArgs('cancelled-password-reset', expectedData);

        await cancelledPasswordResetController.get(request, response);
        await responseMock.verify();
    });

    it('should render cancelled password reset controller for non admin', async () => {
        request['params']['isAdmin'] = 'false';

        const responseMock = sinon.mock(response);

        const expectedData = {
            ...i18n['cancelled-password-reset'],
            betaText: betaText,
            isAdmin: false,
        };

        responseMock.expects('render').once().withArgs('cancelled-password-reset', expectedData);

        await cancelledPasswordResetController.get(request, response);
        await responseMock.verify();
    });
});
