import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import sinon from 'sinon';

import ErrorController from '../../../main/controllers/ErrorController';

const errorController = new ErrorController();

describe('Error controller', () => {
    const response = {
        render: () => {
            return '';
        },
    } as unknown as Response;
    const request = mockRequest({ error: {} });

    it('should render error', async () => {
        const responseMock = sinon.mock(response);

        const i18n = {
            error: {},
        };

        const expectedData = {
            ...i18n['error'],
        };

        responseMock.expects('render').once().withArgs('error', expectedData);

        await errorController.get(request, response);
        await responseMock.verify();
    });
});
