import BulkUnsubscribeConfirmationController from '../../../main/controllers/BulkUnsubscribeConfirmationController';
import sinon from 'sinon';
import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import { SubscriptionService } from '../../../main/service/SubscriptionService';

const bulkDeleteSubscriptionsConfirmationController = new BulkUnsubscribeConfirmationController();

describe('Bulk Unsubscribe Confirmation Controller', () => {
    const i18n = {
        'bulk-unsubscribe-confirmation': {},
        'bulk-unsubscribe-confirmed': {},
        error: {},
    };

    const bulkDeleteConfirmationUrl = 'bulk-unsubscribe-confirmation';
    const bulkDeleteConfirmedUrl = 'bulk-unsubscribe-confirmed';

    describe('GET request', () => {
        it('should render the bulk unsubscribe confirmation page', () => {
            const response = {
                render: () => {
                    return '';
                },
            } as unknown as Response;
            const responseMock = sinon.mock(response);
            const request = mockRequest(i18n);

            responseMock.expects('render').once().withArgs(bulkDeleteConfirmationUrl, i18n[bulkDeleteConfirmationUrl]);

            bulkDeleteSubscriptionsConfirmationController.get(request, response).then(() => {
                responseMock.verify();
            });
        });
    });

    describe('POST request', () => {
        const request = mockRequest(i18n);
        const response = {
            render: () => {
                return '';
            },
            redirect: () => {
                return '';
            },
        } as unknown as Response;

        const caseSubscriptions = {
            caseTableData: [{ subscriptionId: 'abc' }, { subscriptionId: 'def' }],
        };

        const locationSubscriptions = {
            locationTableData: [{ subscriptionId: 'ghi' }],
        };

        const stub = sinon.stub(SubscriptionService.prototype, 'bulkDeleteSubscriptions');
        sinon
            .stub(SubscriptionService.prototype, 'getSelectedSubscriptionDataForView')
            .resolves({ ...caseSubscriptions, ...locationSubscriptions });

        stub.withArgs(['aaa', 'bbb']).resolves(true);
        stub.withArgs(['foo']).resolves(false);

        it("should render the bulk unsubscribe confirmed page if 'Yes' is selected", () => {
            const responseMock = sinon.mock(response);

            request.body = {
                'bulk-unsubscribe-choice': 'yes',
                subscriptions: 'aaa,bbb',
            };
            responseMock.expects('redirect').once().withArgs(bulkDeleteConfirmedUrl);

            bulkDeleteSubscriptionsConfirmationController.post(request, response).then(() => {
                responseMock.verify();
            });
        });

        it("should render error page if 'Yes' is selected and error from Bulk unsubscribe", () => {
            const responseMock = sinon.mock(response);

            request.body = { 'bulk-unsubscribe-choice': 'yes', subscriptions: 'foo' };
            responseMock.expects('render').once().withArgs('error', i18n.error);

            bulkDeleteSubscriptionsConfirmationController.post(request, response).then(() => {
                responseMock.verify();
            });
        });

        it("should redirect to the subscriptions management page if 'No' is selected", () => {
            const responseMock = sinon.mock(response);

            request.body = { 'bulk-unsubscribe-choice': 'no' };
            responseMock.expects('redirect').once().withArgs('subscription-management');

            bulkDeleteSubscriptionsConfirmationController.post(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should render the bulk unsubscribe confirmation page with error if no option selected', () => {
            request.body = { subscriptions: 'abc,def,ghi' };
            const responseMock = sinon.mock(response);

            const expectedData = {
                ...i18n[bulkDeleteConfirmationUrl],
                ...caseSubscriptions,
                ...locationSubscriptions,
                subscriptions: ['abc', 'def', 'ghi'],
                noOptionSelectedError: true,
            };

            responseMock.expects('render').once().withArgs(bulkDeleteConfirmationUrl, expectedData);

            bulkDeleteSubscriptionsConfirmationController.post(request, response).then(() => {
                responseMock.verify();
            });
        });
    });
});
