import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import sinon from 'sinon';

import CrimeRejectedLoginController from '../../../main/controllers/CrimeRejectedLoginController';

const crimeRejectedLoginController = new CrimeRejectedLoginController();

describe('Crime rejected login controller', () => {
    const response = {
        render: () => {
            return '';
        },
    } as unknown as Response;
    const request = mockRequest({ 'crime-rejected-login': {} });

    it('should render crime-rejected-login', async () => {
        const responseMock = sinon.mock(response);

        const i18n = {
            'crime-rejected-login': {},
        };

        const expectedData = {
            ...i18n['crime-rejected-login'],
        };

        responseMock.expects('render').once().withArgs('crime-rejected-login', expectedData);

        await crimeRejectedLoginController.get(request, response);
        await responseMock.verify();
    });
});
