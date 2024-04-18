import sinon from 'sinon';
import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import DeleteSubscriptionController from '../../../main/controllers/DeleteSubscriptionController';

const deleteSubscriptionController = new DeleteSubscriptionController();

describe('Delete Subscription Controller', () => {
    const i18n = { 'delete-subscription': {} };
    const response = {
        render: () => {
            return '';
        },
    } as unknown as Response;
    const request = mockRequest(i18n);

    it('it should render delete subscription page', async () => {
        request.query = { subscription: '' };
        const responseMock = sinon.mock(response);
        const expectedData = {
            ...i18n['delete-subscription'],
            subscription: '',
        };

        responseMock.expects('render').once().withArgs('delete-subscription', expectedData);

        await deleteSubscriptionController.get(request, response);
        responseMock.verify();
    });
});
