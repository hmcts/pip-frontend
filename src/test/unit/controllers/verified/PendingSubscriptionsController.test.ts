import sinon from 'sinon';
import { Response } from 'express';
import { SubscriptionService } from '../../../../main/service/subscriptionService';
import { mockRequest } from '../../mocks/mockRequest';
import PendingSubscriptionsController from '../../../../main/controllers/verified/PendingSubscriptionsController';

const mockCase = {
    hearingId: 1,
    locationId: 50,
    courtNumber: 1,
    date: '15/11/2021 10:00:00',
    judge: 'His Honour Judge A Morley QC',
    platform: 'In person',
    caseNumber: 'T485913',
    caseName: 'Tom Clancy',
    urn: 'N363N6R4OG',
};
const mockCourt = {
    locationId: 643,
    name: 'Aberdeen Tribunal Hearing Centre',
    jurisdiction: 'Tribunal',
    location: 'Scotland',
    hearingList: [],
    hearings: 0,
};
const mockCaseSubscription = {
    caseName: 'My Case A',
    caseNumber: '2222',
    urn: null,
};
const mockCaseSubscription2 = {
    caseName: 'Another Case',
    caseNumber: '1111',
    urn: null,
};
const mockCaseSubscription3 = {
    caseName: 'My Case A',
    caseNumber: null,
    urn: '1111',
};
const mockCourtSubscription = {
    name: 'Birmingham Social Security and Child Support',
    locationId: '4',
};
const mockCourtSubscription2 = {
    name: 'Oxford Combined Court Centre',
    locationId: '3',
};
const mockCourtSubscription3 = {
    name: 'Bradford Social Security and Child Support',
    locationId: '5',
};
const postData = { 'hearing-selections[]': 'T485913' };
const queryParams = { court: '643' };
const userWithSubscriptions = '1';
const userWithoutSubscriptions = '2';
const userWithMultipleSubscriptions = '4';
const pendingSubscriptionController = new PendingSubscriptionsController();
const handleSubStub = sinon.stub(SubscriptionService.prototype, 'handleNewSubscription');
const subscriptionStub = sinon.stub(SubscriptionService.prototype, 'getPendingSubscriptions');
sinon.stub(SubscriptionService.prototype, 'removeFromCache').withArgs(queryParams, '3').resolves(true);
subscriptionStub.withArgs(userWithoutSubscriptions, 'courts').resolves([]);
subscriptionStub.withArgs(userWithoutSubscriptions, 'cases').resolves([]);
subscriptionStub.withArgs(userWithSubscriptions, 'cases').resolves([mockCase]);
subscriptionStub.withArgs(userWithSubscriptions, 'courts').resolves([mockCourt]);
subscriptionStub.withArgs('3', 'cases').resolves([mockCase]);
subscriptionStub.withArgs('3', 'courts').resolves([]);
subscriptionStub
    .withArgs(userWithMultipleSubscriptions, 'cases')
    .resolves([mockCaseSubscription, mockCaseSubscription2, mockCaseSubscription3]);
subscriptionStub
    .withArgs(userWithMultipleSubscriptions, 'courts')
    .resolves([mockCourtSubscription, mockCourtSubscription2, mockCourtSubscription3]);
handleSubStub.withArgs(postData, userWithSubscriptions).resolves(true);

const i18n = { 'pending-subscriptions': {} };
const response = {
    render: () => {
        return '';
    },
} as unknown as Response;

describe('Pending Subscriptions Controller', () => {
    describe('GET view', () => {
        it('should render the pending subscription page without subscriptions', () => {
            const request = mockRequest(i18n);
            request.user = { userId: userWithoutSubscriptions };
            const expectedData = {
                ...i18n['pending-subscriptions'],
                pendingSubscriptions: {
                    cases: [],
                    courts: [],
                },
                displayError: false,
            };
            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('pending-subscriptions', expectedData);

            return pendingSubscriptionController.get(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should render pending subscription page with error summary', () => {
            const request = mockRequest(i18n);
            request.user = { userId: userWithoutSubscriptions };
            request.query = { 'no-subscriptions': 'true' };
            const expectedData = {
                ...i18n['pending-subscriptions'],
                pendingSubscriptions: {
                    cases: [],
                    courts: [],
                },
                displayError: true,
            };
            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('pending-subscriptions', expectedData);

            return pendingSubscriptionController.get(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should render pending subscriptions page with set subscriptions', () => {
            const request = mockRequest(i18n);
            request.user = { userId: userWithSubscriptions };
            const expectedData = {
                ...i18n['pending-subscriptions'],
                pendingSubscriptions: {
                    cases: [mockCase],
                    courts: [mockCourt],
                },
                displayError: false,
            };
            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('pending-subscriptions', expectedData);

            return pendingSubscriptionController.get(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should render pending subscriptions page with multiple subscriptions', () => {
            const request = mockRequest(i18n);
            request.user = { userId: userWithMultipleSubscriptions };
            const expectedData = {
                ...i18n['pending-subscriptions'],
                pendingSubscriptions: {
                    cases: [mockCaseSubscription2, mockCaseSubscription3, mockCaseSubscription],
                    courts: [mockCourtSubscription, mockCourtSubscription3, mockCourtSubscription2],
                },
                displayError: false,
            };
            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('pending-subscriptions', expectedData);

            return pendingSubscriptionController.get(request, response).then(() => {
                responseMock.verify();
            });
        });
    });

    describe('POST view', () => {
        it('should render pending subscriptions page if post data is provided', () => {
            const request = mockRequest(i18n);
            request.user = { userId: '3' };
            request.body = postData;
            const expectedData = {
                ...i18n['pending-subscriptions'],
                pendingSubscriptions: {
                    cases: [mockCase],
                    courts: [],
                },
            };
            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('pending-subscriptions', expectedData);

            return pendingSubscriptionController.post(request, response).then(() => {
                responseMock.verify();
            });
        });
    });

    describe('removeSubscription view', () => {
        it('should render pending subscriptions page on removeSubscription call', () => {
            const request = mockRequest(i18n);
            request.user = { userId: '3' };
            request.query = queryParams;
            const expectedData = {
                ...i18n['pending-subscriptions'],
                pendingSubscriptions: {
                    cases: [mockCase],
                    courts: [],
                },
            };
            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('pending-subscriptions', expectedData);

            return pendingSubscriptionController.removeSubscription(request, response).then(() => {
                responseMock.verify();
            });
        });
    });
});
