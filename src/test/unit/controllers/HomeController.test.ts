import { mockRequest } from '../mocks/mockRequest';
import { Response } from 'express';
import sinon from 'sinon';
import HomeController from '../../../main/controllers/HomeController';

const i18n = { home: {} };
const homeController = new HomeController();

describe('Home Controller', () => {
    it('should render a page', async () => {
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        const responseMock = sinon.mock(response);
        request['lng'] = 'en';
        const expectedOptions = {
            ...i18n.home,
            currentLanguage: 'en',
        };

        responseMock.expects('render').once().withArgs('home', expectedOptions);

        await homeController.get(request, response);
        responseMock.verify();
    });

    it('should render a page with English language query param', async () => {
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        const responseMock = sinon.mock(response);
        request['lng'] = 'en';
        request.query = { lng: 'en' };
        const expectedOptions = {
            ...i18n.home,
            currentLanguage: 'en',
        };

        responseMock.expects('render').once().withArgs('home', expectedOptions);

        await homeController.get(request, response);
        responseMock.verify();
    });

    it('should render a page with Welsh language query param', async () => {
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        const responseMock = sinon.mock(response);
        request['lng'] = 'cy';
        request.query = { lng: 'cy' };
        const expectedOptions = {
            ...i18n.home,
            currentLanguage: 'cy',
        };

        responseMock.expects('render').once().withArgs('home', expectedOptions);

        await homeController.get(request, response);
        responseMock.verify();
    });

    it('should render a page as english if blank param supplied', async () => {
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        const responseMock = sinon.mock(response);
        request['lng'] = '';
        request.query = { lng: '' };
        const expectedOptions = {
            ...i18n.home,
            currentLanguage: 'en',
        };

        responseMock.expects('render').once().withArgs('home', expectedOptions);

        await homeController.get(request, response);
        responseMock.verify();
    });

    it('should render a page as english if incorrect param supplied', async () => {
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        const responseMock = sinon.mock(response);
        request['lng'] = '';
        request.query = { lng: 'de' };
        const expectedOptions = {
            ...i18n.home,
            currentLanguage: 'en',
        };

        responseMock.expects('render').once().withArgs('home', expectedOptions);

        await homeController.get(request, response);
        responseMock.verify();
    });
});
