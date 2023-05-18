import { mockRequest } from '../mocks/mockRequest';
import { Response } from 'express';
import sinon from 'sinon';
import MediaRejectedLoginController from '../../../main/controllers/MediaRejectedLoginController';

const mediaRejectedLoginController = new MediaRejectedLoginController();

describe('Media rejected login controller', () => {
    const response = {
        render: () => {
            return '';
        },
    } as unknown as Response;
    const request = mockRequest({ 'media-rejected-login': {} });

    it('should render media-rejected-login', async () => {
        const responseMock = sinon.mock(response);

        const i18n = {
            'media-rejected-login': {},
        };

        const expectedData = {
            ...i18n['media-rejected-login'],
            frontendUrl: process.env.FRONTEND_URL,
        };

        responseMock.expects('render').once().withArgs('media-rejected-login', expectedData);

        await mediaRejectedLoginController.get(request, response);
        await responseMock.verify();
    });
});
