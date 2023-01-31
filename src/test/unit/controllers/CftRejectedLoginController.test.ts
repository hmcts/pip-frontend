import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import sinon from 'sinon';

import CftRejectedLoginController from '../../../main/controllers/CftRejectedLoginController';

const cftRejectedLoginController = new CftRejectedLoginController();

describe('CFT rejected login controller', () => {
    const response = {
        render: () => {
            return '';
        },
    } as unknown as Response;
    const request = mockRequest({ 'cft-rejected-login': {} });

    it('should render cft-rejected-login', async () => {
        const responseMock = sinon.mock(response);

        const i18n = {
            'cft-rejected-login': {},
        };

        const expectedData = {
            ...i18n['cft-rejected-login'],
        };

        responseMock.expects('render').once().withArgs('cft-rejected-login', expectedData);

        await cftRejectedLoginController.get(request, response);
        await responseMock.verify();
    });
});
