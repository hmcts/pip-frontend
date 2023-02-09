import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import sinon from 'sinon';
import DeleteCourtSubscriptionSuccessController from '../../../main/controllers/DeleteCourtSubscriptionSuccessController';

const deleteCourtSubscriptionSuccessController = new DeleteCourtSubscriptionSuccessController();

describe('Delete Court Subscription Data Controller', () => {
    it('should render the court subscription list page', () => {
        const i18n = { 'delete-court-subscription-success': {} };
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.path = '/delete-court-subscription-success';
        const responseMock = sinon.mock(response);
        const expectedData = {
            ...i18n['delete-court-subscription-success'],
        };

        responseMock.expects('render').once().withArgs('delete-court-subscription-success', expectedData);
        return deleteCourtSubscriptionSuccessController.get(request, response).then(() => {
            responseMock.verify();
        });
    });

    it('should render the court publication list page', () => {
        const i18n = { 'delete-court-publication-success': {} };
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.path = '/delete-court-publication-success';
        const responseMock = sinon.mock(response);
        const expectedData = {
            ...i18n['delete-court-publication-success'],
        };

        responseMock.expects('render').once().withArgs('delete-court-publication-success', expectedData);
        return deleteCourtSubscriptionSuccessController.get(request, response).then(() => {
            responseMock.verify();
        });
    });
});
