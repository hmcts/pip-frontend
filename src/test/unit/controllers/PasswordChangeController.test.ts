import { mockRequest } from '../mocks/mockRequest';
import { Response } from 'express';
import sinon from 'sinon';
import PasswordChangeController from '../../../main/controllers/PasswordChangeController';

const passwordChangeController = new PasswordChangeController();

describe('Password Change Confirmation controller', () => {
    const response = {
        render: () => {
            return '';
        },
    } as unknown as Response;

    const betaText = 'test beta text';
    const i18n = {
        'password-change-confirmation': {},
        template: { betaHeadingAdmin: betaText },
    };
    const request = mockRequest(i18n);

    it('should render password-change-confirmation for an admin', async () => {
        request.params['isAdmin'] = 'true';
        const responseMock = sinon.mock(response);

        const i18n = {
            'password-change-confirmation': {},
        };

        const expectedData = {
            ...i18n['password-change-confirmation'],
            betaText: betaText,
            isAdmin: true,
        };

        responseMock.expects('render').once().withArgs('password-change-confirmation', expectedData);

        await passwordChangeController.post(request, response);
        await responseMock.verify();
    });

    it('should render password-change-confirmation for a media user', async () => {
        request.params['isAdmin'] = 'false';
        const responseMock = sinon.mock(response);

        const i18n = {
            'password-change-confirmation': {},
        };

        const expectedData = {
            ...i18n['password-change-confirmation'],
            betaText: betaText,
            isAdmin: false,
        };

        responseMock.expects('render').once().withArgs('password-change-confirmation', expectedData);

        await passwordChangeController.post(request, response);
        await responseMock.verify();
    });
});
