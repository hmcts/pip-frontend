import BulkUnsubscribeController from '../../../main/controllers/BulkUnsubscribeController';
import sinon from 'sinon';
import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import { SubscriptionService } from '../../../main/service/SubscriptionService';

const bulkDeleteSubscriptionsController = new BulkUnsubscribeController();

const bulkDeleteSubscriptionsUrl = 'bulk-unsubscribe';
const bulkDeleteConfirmationUrl = 'bulk-unsubscribe-confirmation';

const userId = '1';

const caseSubscriptions = [{ subscriptionId: '123' }];

const locationSubscriptions = [{ subscriptionId: '456' }];

const userSubscriptions = {
    caseSubscriptions: caseSubscriptions,
    locationSubscriptions: locationSubscriptions,
};

sinon.stub(SubscriptionService.prototype, 'getSubscriptionsByUser').resolves(userSubscriptions);
const caseTableStub = sinon.stub(SubscriptionService.prototype, 'generateCaseTableRows');
const locationTableStub = sinon.stub(SubscriptionService.prototype, 'generateLocationTableRows');

caseTableStub.withArgs(caseSubscriptions).resolves(caseSubscriptions);
caseTableStub.withArgs([]).resolves([]);
locationTableStub.withArgs(locationSubscriptions).resolves(locationSubscriptions);
locationTableStub.withArgs([]).resolves([]);

const response = {
    render: () => {
        return '';
    },
} as unknown as Response;

const i18n = {
    'bulk-unsubscribe': {},
    'bulk-unsubscribe-confirmation': {},
    error: {},
};

describe('Bulk Unsubscribe Controller', () => {
    describe('GET request', () => {
        it('should render the bulk unsubscribe page with all tab as default', () => {
            const request = mockRequest(i18n);
            request.user = { userId: userId };
            request.query = {};

            const expectedData = {
                ...i18n[bulkDeleteSubscriptionsUrl],
                caseTableData: caseSubscriptions,
                locationTableData: locationSubscriptions,
                activeAllTab: true,
                activeCaseTab: false,
                activeLocationTab: false,
            };

            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs(bulkDeleteSubscriptionsUrl, expectedData);

            bulkDeleteSubscriptionsController.get(request, response).then(() => {
                responseMock.verify();
            });
        });

        it("should render the bulk unsubscribe page with 'all' query param", () => {
            const request = mockRequest(i18n);
            request.user = { userId: userId };
            request.query = { all: 'true' };

            const expectedData = {
                ...i18n[bulkDeleteSubscriptionsUrl],
                caseTableData: caseSubscriptions,
                locationTableData: locationSubscriptions,
                activeAllTab: true,
                activeCaseTab: false,
                activeLocationTab: false,
            };

            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs(bulkDeleteSubscriptionsUrl, expectedData);

            bulkDeleteSubscriptionsController.get(request, response).then(() => {
                responseMock.verify();
            });
        });

        it("should render the bulk unsubscribe page with 'case' query param", () => {
            const request = mockRequest(i18n);
            request.user = { userId: userId };
            request.query = { case: 'true' };

            const expectedData = {
                ...i18n[bulkDeleteSubscriptionsUrl],
                caseTableData: caseSubscriptions,
                locationTableData: locationSubscriptions,
                activeAllTab: false,
                activeCaseTab: true,
                activeLocationTab: false,
            };

            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs(bulkDeleteSubscriptionsUrl, expectedData);

            bulkDeleteSubscriptionsController.get(request, response).then(() => {
                responseMock.verify();
            });
        });

        it("should render the bulk unsubscribe page with 'court' query param", () => {
            const request = mockRequest(i18n);
            request.user = { userId: userId };
            request.query = { location: 'true' };

            const expectedData = {
                ...i18n[bulkDeleteSubscriptionsUrl],
                caseTableData: caseSubscriptions,
                locationTableData: locationSubscriptions,
                activeAllTab: false,
                activeCaseTab: false,
                activeLocationTab: true,
            };

            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs(bulkDeleteSubscriptionsUrl, expectedData);

            bulkDeleteSubscriptionsController.get(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should render error page if there is no user defined', () => {
            const request = mockRequest(i18n);
            request.user = undefined;

            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('error', i18n.error);

            bulkDeleteSubscriptionsController.get(request, response).then(() => {
                responseMock.verify();
            });
        });
    });

    describe('POST request', () => {
        it('should render the bulk unsubscribe page with error if no subscriptions selected', () => {
            const request = mockRequest(i18n);
            request.user = { userId: userId };
            request.query = {};

            const expectedData = {
                ...i18n[bulkDeleteSubscriptionsUrl],
                caseTableData: caseSubscriptions,
                locationTableData: locationSubscriptions,
                activeAllTab: true,
                activeCaseTab: false,
                activeLocationTab: false,
                noOptionSelectedError: true,
            };

            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs(bulkDeleteSubscriptionsUrl, expectedData);

            bulkDeleteSubscriptionsController.post(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should render the bulk unsubscribe confirmation page if a case subscription selected', () => {
            const request = mockRequest(i18n);
            request.user = { userId: userId };
            request.body = { caseSubscription: '123' };

            const expectedData = {
                ...i18n[bulkDeleteConfirmationUrl],
                caseTableData: caseSubscriptions,
                locationTableData: [],
                subscriptions: ['123'],
            };

            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs(bulkDeleteConfirmationUrl, expectedData);

            bulkDeleteSubscriptionsController.post(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should render the bulk unsubscribe confirmation page if a court subscription selected', () => {
            const request = mockRequest(i18n);
            request.user = { userId: userId };
            request.body = { courtSubscription: '456' };

            const expectedData = {
                ...i18n[bulkDeleteConfirmationUrl],
                caseTableData: [],
                locationTableData: locationSubscriptions,
                subscriptions: ['456'],
            };

            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs(bulkDeleteConfirmationUrl, expectedData);

            bulkDeleteSubscriptionsController.post(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should render the bulk unsubscribe confirmation page if both case and court subscriptions selected', () => {
            const request = mockRequest(i18n);
            request.user = { userId: userId };
            request.body = {
                caseSubscription: '123',
                courtSubscription: '456',
            };

            const expectedData = {
                ...i18n[bulkDeleteConfirmationUrl],
                caseTableData: caseSubscriptions,
                locationTableData: locationSubscriptions,
                subscriptions: ['123', '456'],
            };

            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs(bulkDeleteConfirmationUrl, expectedData);

            bulkDeleteSubscriptionsController.post(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should render error page if there is no user defined', () => {
            const request = mockRequest(i18n);
            request.user = undefined;

            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('error', i18n.error);

            bulkDeleteSubscriptionsController.post(request, response).then(() => {
                responseMock.verify();
            });
        });
    });
});
