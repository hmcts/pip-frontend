import { mockRequest } from '../mocks/mockRequest';
import { Response } from 'express';
import sinon from 'sinon';
import CookiePolicyPageController from '../../../main/controllers/CookiePolicyPageController';

const cookiesPageController = new CookiePolicyPageController();

describe('Cookies Page controller', () => {
    it('should render cookies page', async () => {
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest({ 'cookie-policy': {} });
        const responseMock = sinon.mock(response);

        responseMock
            .expects('render')
            .once()
            .withArgs('cookie-policy', request.i18n.getDataByLanguage(request.lng)['cookie-policy']);
        await cookiesPageController.get(request, response);
        await responseMock.verify();
    });
});
