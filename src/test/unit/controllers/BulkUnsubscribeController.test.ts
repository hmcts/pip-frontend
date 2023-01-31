import BulkUnsubscribeController from '../../../main/controllers/BulkUnsubscribeController';
import sinon from 'sinon';
import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import { SubscriptionService } from '../../../main/service/subscriptionService';

const bulkDeleteSubscriptionsController = new BulkUnsubscribeController();

describe('Bulk Unsubscribe Controller', () => {
    const i18n = {
        'bulk-unsubscribe': {},
        'bulk-unsubscribe-confirmation': {},
        error: {},
    };

    const tableData = {
        caseTableData: [],
        courtTableData: [],
    };

    const bulkDeleteSubscriptionsUrl = 'bulk-unsubscribe';
    const bulkDeleteConfirmationUrl = 'bulk-unsubscribe-confirmation';

    describe('GET request', () => {
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        let responseMock;
        const request = mockRequest(i18n);
        const stubCase = [];
        const stubCourt = [];

        beforeEach(function () {
            sinon.stub(SubscriptionService.prototype, 'generateCaseTableRows').returns({ cases: [] });
            sinon.stub(SubscriptionService.prototype, 'generateLocationTableRows').returns({ courts: [] });
            responseMock = sinon.mock(response);
        });

        afterEach(function () {
            sinon.restore();
        });

        it('should render the bulk unsubscribe page with all tab as default', () => {
            const expectedData = {
                ...i18n[bulkDeleteSubscriptionsUrl],
                stubCase,
                stubCourt,
                activeAllTab: true,
                activeCaseTab: false,
                activeCourtTab: false,
            };

            request.query = {};
            responseMock.expects('render').once().withArgs(bulkDeleteSubscriptionsUrl, expectedData);

            bulkDeleteSubscriptionsController.get(request, response).then(() => {
                responseMock.verify();
            });
        });

        it("should render the bulk unsubscribe page with 'all' query param", () => {
            const expectedData = {
                ...i18n[bulkDeleteSubscriptionsUrl],
                ...tableData,
                activeAllTab: true,
                activeCaseTab: false,
                activeCourtTab: false,
            };

            request.query = { all: 'true' };
            responseMock.expects('render').once().withArgs(bulkDeleteSubscriptionsUrl, expectedData);

            bulkDeleteSubscriptionsController.get(request, response).then(() => {
                responseMock.verify();
            });
        });

        it("should render the bulk unsubscribe page with 'case' query param", () => {
            const expectedData = {
                ...i18n[bulkDeleteSubscriptionsUrl],
                ...tableData,
                activeAllTab: false,
                activeCaseTab: true,
                activeCourtTab: false,
            };

            request.query = { case: 'true' };
            responseMock.expects('render').once().withArgs(bulkDeleteSubscriptionsUrl, expectedData);

            bulkDeleteSubscriptionsController.get(request, response).then(() => {
                responseMock.verify();
            });
        });

        it("should render the bulk unsubscribe page with 'court' query param", () => {
            const expectedData = {
                ...i18n[bulkDeleteSubscriptionsUrl],
                ...tableData,
                activeAllTab: false,
                activeCaseTab: false,
                activeCourtTab: true,
            };

            request.query = { court: 'true' };
            responseMock.expects('render').once().withArgs(bulkDeleteSubscriptionsUrl, expectedData);

            bulkDeleteSubscriptionsController.get(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should render error page if there is no user defined', () => {
            request.user = undefined;
            responseMock.expects('render').once().withArgs('error', i18n.error);

            bulkDeleteSubscriptionsController.get(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should render error page if data is null', () => {
            sinon.restore();
            sinon.stub(SubscriptionService.prototype, 'generateCaseTableRows').returns(null);
            sinon.stub(SubscriptionService.prototype, 'generateLocationTableRows').returns(null);
            responseMock.expects('render').once().withArgs('error', i18n.error);

            bulkDeleteSubscriptionsController.get(request, response).then(() => {
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
        } as unknown as Response;

        beforeEach(function () {
            sinon.stub(SubscriptionService.prototype, 'generateCaseTableRows').returns({ cases: [] });
            sinon.stub(SubscriptionService.prototype, 'generateLocationTableRows').returns({ courts: [] });
        });

        afterEach(function () {
            sinon.restore();
        });

        it('should render the bulk unsubscribe page with error if no subscriptions selected', () => {
            const responseMock = sinon.mock(response);

            const expectedData = {
                ...i18n[bulkDeleteSubscriptionsUrl],
                ...tableData,
                activeAllTab: false,
                activeCaseTab: false,
                activeCourtTab: true,
                noOptionSelectedError: true,
            };

            request.query = {};
            request.body = {};
            responseMock.expects('render').once().withArgs(bulkDeleteSubscriptionsUrl, expectedData);

            bulkDeleteSubscriptionsController.post(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should render the bulk unsubscribe confirmation page if a case subscription selected', () => {
            const responseMock = sinon.mock(response);

            const expectedData = {
                ...i18n[bulkDeleteConfirmationUrl],
                subscriptions: ['123'],
            };

            request.query = {};
            request.body = { caseSubscription: '123' };
            responseMock.expects('render').once().withArgs(bulkDeleteConfirmationUrl, expectedData);

            bulkDeleteSubscriptionsController.post(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should render the bulk unsubscribe page if a court subscription selected', () => {
            const responseMock = sinon.mock(response);

            const expectedData = {
                ...i18n[bulkDeleteConfirmationUrl],
                subscriptions: ['123'],
            };

            request.query = {};
            request.body = { courtSubscription: '123' };
            responseMock.expects('render').once().withArgs(bulkDeleteConfirmationUrl, expectedData);

            bulkDeleteSubscriptionsController.post(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should render the bulk unsubscribe page if both case and court subscriptions selected', () => {
            const responseMock = sinon.mock(response);

            const expectedData = {
                ...i18n[bulkDeleteConfirmationUrl],
                subscriptions: ['123', '456', '789'],
            };

            request.query = {};
            request.body = {
                caseSubscription: ['123', '456'],
                courtSubscription: '789',
            };
            responseMock.expects('render').once().withArgs(bulkDeleteConfirmationUrl, expectedData);

            bulkDeleteSubscriptionsController.post(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should render error page if there is no user defined', () => {
            const responseMock = sinon.mock(response);
            request.user = undefined;
            responseMock.expects('render').once().withArgs('error', i18n.error);

            bulkDeleteSubscriptionsController.post(request, response).then(() => {
                responseMock.verify();
            });
        });
    });
});
