import SubscriptionManagementController from '../../../main/controllers/SubscriptionManagementController';
import sinon from 'sinon';
import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import { SubscriptionService } from '../../../main/service/SubscriptionService';
import { cloneDeep } from 'lodash';

const subscriptionManagementController = new SubscriptionManagementController();

describe('Subscriptions Management Controller', () => {
    sinon.stub(SubscriptionService.prototype, 'generateCaseTableRows').returns({ cases: [] });
    sinon.stub(SubscriptionService.prototype, 'generateLocationTableRows').returns({ courts: [] });

    const response = {
        render: () => {
            return '';
        },
    } as unknown as Response;
    let responseMock;

    beforeEach(function () {
        sinon.restore();
        responseMock = sinon.mock(response);
    });

    const i18n = {
        'subscription-management': {},
        error: {},
    };
    const tableData = {
        caseTableData: [],
        courtTableData: [],
    };

    const request = mockRequest(i18n);
    const stubCase = [];
    const stubCourt = [];

    it('should render the subscription management page with all as default', () => {
        request.query = {};

        const expectedData = {
            ...cloneDeep(request.i18n.getDataByLanguage(request.lng)['subscription-management']),
            stubCase,
            stubCourt,
            activeAllTab: true,
            activeCaseTab: false,
            activeCourtTab: false,
            activeSubscriptionPage: true,
        };

        responseMock.expects('render').once().withArgs('subscription-management', expectedData);

        subscriptionManagementController.get(request, response).then(() => {
            responseMock.verify();
        });
    });

    it('should render the subscription management page with all query param', () => {
        request.query = { all: 'true' };

        const expectedData = {
            ...i18n['subscription-management'],
            ...tableData,
            activeAllTab: true,
            activeCaseTab: false,
            activeCourtTab: false,
            activeSubscriptionPage: true,
        };

        responseMock.expects('render').once().withArgs('subscription-management', expectedData);

        subscriptionManagementController.get(request, response).then(() => {
            responseMock.verify();
        });
    });

    it('should render the subscription management page with case query param', () => {
        request.query = { case: 'true' };

        const expectedData = {
            ...i18n['subscription-management'],
            ...tableData,
            activeAllTab: false,
            activeCaseTab: true,
            activeCourtTab: false,
            activeSubscriptionPage: true,
        };

        responseMock.expects('render').once().withArgs('subscription-management', expectedData);

        subscriptionManagementController.get(request, response).then(() => {
            responseMock.verify();
        });
    });

    it('should render the subscription management page with court query param', () => {
        request.query = { court: 'true' };

        const expectedData = {
            ...i18n['subscription-management'],
            ...tableData,
            activeAllTab: false,
            activeCaseTab: false,
            activeCourtTab: true,
            activeSubscriptionPage: true,
        };

        responseMock.expects('render').once().withArgs('subscription-management', expectedData);

        subscriptionManagementController.get(request, response).then(() => {
            responseMock.verify();
        });
    });

    it('should render error page if there is no user data', () => {
        const erroredRequest = mockRequest(i18n);
        erroredRequest.user = undefined;

        responseMock
            .expects('render')
            .once()
            .withArgs('error', erroredRequest.i18n.getDataByLanguage(request.lng).error);

        subscriptionManagementController.get(erroredRequest, response).then(() => {
            responseMock.verify();
        });
    });
});
