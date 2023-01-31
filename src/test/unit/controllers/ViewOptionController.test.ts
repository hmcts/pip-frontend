import sinon from 'sinon';
import { Response } from 'express';
import ViewOptionController from '../../../main/controllers/ViewOptionController';
import { mockRequest } from '../mocks/mockRequest';

const viewOptionController = new ViewOptionController();

describe('View Option Controller', () => {
    const i18n = { 'view-option': {} };
    it('should render view options page', () => {
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        const responseMock = sinon.mock(response);
        const expectedOptions = {
            ...i18n['view-option'],
            showError: false,
        };

        responseMock.expects('render').once().withArgs('view-option', expectedOptions);
        viewOptionController.get(request, response);
        responseMock.verify();
    });

    it("should render search option page if choice is 'search'", () => {
        const response = {
            redirect: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.body = { 'view-choice': 'search' };
        const responseMock = sinon.mock(response);

        responseMock.expects('redirect').once().withArgs('search');

        viewOptionController.post(request, response);
        responseMock.verify();
    });

    it("should render live hearings page if choice is 'live'", () => {
        const response = {
            redirect: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.body = { 'view-choice': 'live' };
        const responseMock = sinon.mock(response);

        responseMock.expects('redirect').once().withArgs('live-case-alphabet-search');

        viewOptionController.post(request, response);
        responseMock.verify();
    });

    it("should render single justice procedure page if choice is 'sjp'", () => {
        const response = {
            redirect: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.body = { 'view-choice': 'sjp' };
        const responseMock = sinon.mock(response);

        responseMock.expects('redirect').once().withArgs('summary-of-publications?locationId=9');

        viewOptionController.post(request, response);
        responseMock.verify();
    });

    it('should render same page if nothing selected', () => {
        const viewOptionController = new ViewOptionController();
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.body = { 'view-choice': '' };
        const expectedOptions = {
            ...i18n['view-option'],
            showError: true,
        };
        const responseMock = sinon.mock(response);

        responseMock.expects('render').once().withArgs('view-option', expectedOptions);

        viewOptionController.post(request, response);
        responseMock.verify();
    });
});
