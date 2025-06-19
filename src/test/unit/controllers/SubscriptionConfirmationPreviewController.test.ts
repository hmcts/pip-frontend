import sinon from 'sinon';
import { Response } from 'express';
import { SubscriptionService } from '../../../main/service/SubscriptionService';
import { mockRequest } from '../mocks/mockRequest';
import SubscriptionConfirmationPreviewController from '../../../main/controllers/SubscriptionConfirmationPreviewController';
import { PendingSubscriptionsFromCache } from '../../../main/service/PendingSubscriptionsFromCache';

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

const mockListTypeValue = 'listType1';
const mockListTypeText = 'List Type1';

const mockListType = {
    value: mockListTypeValue,
    text: mockListTypeText,
};
const mockListLanguage = 'ENGLISH';

const mockListTypeValue2 = 'listType2';
const mockListTypeText2 = 'List Type2';
const mockListType2 = {
    value: mockListTypeValue2,
    text: mockListTypeText2,
};

const postData = { 'hearing-selections[]': 'T485913' };
const queryParams = { court: '643' };
const queryParamsWithCaseNumber = { 'case-number': '1' };
const userWithSubscriptions = '1';
const userWithoutSubscriptions = '2';
const userRemoveCourtSubscription = '3';
const userWithMultipleSubscriptions = '4';
const userRemoveCaseSubscription = '5';
const subscriptionConfirmationPreviewController = new SubscriptionConfirmationPreviewController();
const handleSubStub = sinon.stub(SubscriptionService.prototype, 'handleNewSubscription');
const subscriptionStub = sinon.stub(SubscriptionService.prototype, 'getPendingSubscriptions');
const cacheStub = sinon.stub(PendingSubscriptionsFromCache.prototype, 'getPendingSubscriptions');
const subscribeStub = sinon.stub(SubscriptionService.prototype, 'subscribe');
const friendlyNameStub = sinon.stub(SubscriptionService.prototype, 'findListTypeFriendlyName');
const removeListTypeStub = sinon.stub(SubscriptionService.prototype, 'removeListTypeForCourt');
const removeFromCacheStub = sinon.stub(SubscriptionService.prototype, 'removeFromCache');

removeFromCacheStub.withArgs(queryParams, userRemoveCourtSubscription).resolves(true);

subscriptionStub.withArgs(userWithoutSubscriptions, 'courts').resolves([]);
subscriptionStub.withArgs(userWithoutSubscriptions, 'cases').resolves([]);
subscriptionStub.withArgs(userWithoutSubscriptions, 'listTypes').resolves([]);
subscriptionStub.withArgs(userWithoutSubscriptions, 'listLanguage').resolves([]);

subscriptionStub.withArgs(userWithSubscriptions, 'cases').resolves([mockCase]);
subscriptionStub.withArgs(userWithSubscriptions, 'courts').resolves([mockCourt]);
subscriptionStub.withArgs(userWithSubscriptions, 'listTypes').resolves([mockListTypeValue]);
subscriptionStub.withArgs(userWithSubscriptions, 'listLanguage').resolves([mockListLanguage]);

subscriptionStub.withArgs(userRemoveCourtSubscription, 'cases').resolves([mockCase]);
subscriptionStub.withArgs(userRemoveCourtSubscription, 'courts').resolves([mockCourt]);
subscriptionStub.withArgs(userRemoveCourtSubscription, 'listTypes').resolves([]);
subscriptionStub.withArgs(userRemoveCourtSubscription, 'listLanguage').resolves([]);

subscriptionStub.withArgs(userRemoveCaseSubscription, 'cases').resolves([]);
subscriptionStub.withArgs(userRemoveCaseSubscription, 'courts').resolves([mockCourt]);
subscriptionStub.withArgs(userRemoveCaseSubscription, 'listTypes').resolves([mockListTypeValue]);
subscriptionStub.withArgs(userRemoveCaseSubscription, 'listLanguage').resolves([mockListLanguage]);

cacheStub.withArgs(userRemoveCourtSubscription, 'cases').resolves([mockCase]);
cacheStub.withArgs(userRemoveCourtSubscription, 'courts').resolves([mockCourt]);
cacheStub.withArgs(userRemoveCourtSubscription, 'listTypes').resolves([]);
cacheStub.withArgs(userRemoveCourtSubscription, 'listLanguage').resolves([]);

cacheStub.withArgs(userRemoveCaseSubscription, 'cases').resolves([]);
cacheStub.withArgs(userRemoveCaseSubscription, 'courts').resolves([mockCourt]);
cacheStub.withArgs(userRemoveCaseSubscription, 'listTypes').resolves([mockListTypeValue]);
cacheStub.withArgs(userRemoveCaseSubscription, 'listLanguage').resolves([mockListLanguage]);

subscriptionStub
    .withArgs(userWithMultipleSubscriptions, 'cases')
    .resolves([mockCaseSubscription, mockCaseSubscription2, mockCaseSubscription3]);
subscriptionStub
    .withArgs(userWithMultipleSubscriptions, 'courts')
    .resolves([mockCourtSubscription, mockCourtSubscription2, mockCourtSubscription3]);
subscriptionStub.withArgs(userWithMultipleSubscriptions, 'listTypes').resolves([mockListTypeValue, mockListTypeValue2]);
subscriptionStub.withArgs(userWithMultipleSubscriptions, 'listLanguage').resolves([mockListLanguage]);

handleSubStub.withArgs(postData, userWithSubscriptions).resolves(true);

cacheStub.withArgs(userWithSubscriptions, 'cases').resolves([mockCase]);
cacheStub.withArgs(userWithSubscriptions, 'listTypes').resolves([mockListTypeValue]);
cacheStub.withArgs(userWithSubscriptions, 'listLanguage').resolves([mockListLanguage]);

subscribeStub.withArgs(userWithSubscriptions).resolves(true);
subscribeStub.withArgs(userRemoveCourtSubscription).resolves(false);

friendlyNameStub.withArgs(mockListTypeValue).resolves(mockListTypeText);
friendlyNameStub.withArgs(mockListTypeValue2).resolves(mockListTypeText2);

removeListTypeStub.withArgs('PI_AAD', userRemoveCourtSubscription).resolves(true);

const i18n = {
    'subscription-confirmation-preview': {},
    error: {},
};
const response = {
    render: () => {
        return '';
    },
    redirect: () => {
        return '';
    },
} as unknown as Response;

describe('Subscription Confirmation Preview Controller', () => {
    describe('GET view', () => {
        it('should render the subscription confirmation preview page without subscriptions', () => {
            const request = mockRequest(i18n);
            request.user = { userId: userWithoutSubscriptions };
            const expectedData = {
                ...i18n['subscription-confirmation-preview'],
                pendingSubscriptions: {
                    cases: [],
                    courts: [],
                    listTypes: [],
                    listLanguage: [],
                },
                displayError: false,
            };
            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('subscription-confirmation-preview', expectedData);

            return subscriptionConfirmationPreviewController.get(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should render subscription confirmation preview page with error summary', () => {
            const request = mockRequest(i18n);
            request.user = { userId: userWithoutSubscriptions };
            request.query = { error: 'true' };
            const expectedData = {
                ...i18n['subscription-confirmation-preview'],
                pendingSubscriptions: {
                    cases: [],
                    courts: [],
                    listTypes: [],
                    listLanguage: [],
                },
                displayError: true,
            };
            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('subscription-confirmation-preview', expectedData);

            return subscriptionConfirmationPreviewController.get(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should render Subscription Confirmation Preview page with set subscriptions', () => {
            const request = mockRequest(i18n);
            request.user = { userId: userWithSubscriptions };
            const expectedData = {
                ...i18n['subscription-confirmation-preview'],
                pendingSubscriptions: {
                    cases: [mockCase],
                    courts: [mockCourt],
                    listTypes: [mockListType],
                    listLanguage: [mockListLanguage],
                },
                displayError: false,
            };
            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('subscription-confirmation-preview', expectedData);

            return subscriptionConfirmationPreviewController.get(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should render Subscription Confirmation Preview page with multiple subscriptions', () => {
            const request = mockRequest(i18n);
            request.user = { userId: userWithMultipleSubscriptions };
            const expectedData = {
                ...i18n['subscription-confirmation-preview'],
                pendingSubscriptions: {
                    cases: [mockCaseSubscription2, mockCaseSubscription3, mockCaseSubscription],
                    courts: [mockCourtSubscription, mockCourtSubscription3, mockCourtSubscription2],
                    listTypes: [mockListType, mockListType2],
                    listLanguage: [mockListLanguage],
                },
                displayError: false,
            };
            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('subscription-confirmation-preview', expectedData);

            return subscriptionConfirmationPreviewController.get(request, response).then(() => {
                responseMock.verify();
            });
        });
    });

    describe('POST view', () => {
        it('should redirect to confirmed page if subscribed successfully', () => {
            const request = mockRequest(i18n);
            request.user = { userId: userWithSubscriptions };

            const responseMock = sinon.mock(response);
            responseMock.expects('redirect').once().withArgs('/subscription-confirmed');

            return subscriptionConfirmationPreviewController.post(request, response).then(() => {
                responseMock.verify();
            });
        });
    });

    describe('removePendingSubscription view', () => {
        it('should render Subscription Confirmation Preview page on removePendingSubscription call', () => {
            const request = mockRequest(i18n);
            request.user = { userId: userRemoveCourtSubscription, userProvenance: 'PI_AAD' };
            request.lng = 'en';
            request.query = queryParams;
            const expectedData = {
                ...i18n['subscription-confirmation-preview'],
                pendingSubscriptions: {
                    cases: [mockCase],
                    courts: [mockCourt],
                    listTypes: [],
                    listLanguage: [],
                },
                displayError: false,
            };
            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('subscription-confirmation-preview', expectedData);

            return subscriptionConfirmationPreviewController.removePendingSubscription(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should render Subscription Confirmation Preview page on removePendingSubscription call when case is deleted', () => {
            const request = mockRequest(i18n);
            request.user = { userId: userRemoveCaseSubscription };
            request.lng = 'en';
            request.query = queryParamsWithCaseNumber;
            const expectedData = {
                ...i18n['subscription-confirmation-preview'],
                pendingSubscriptions: {
                    cases: [],
                    courts: [mockCourt],
                    listTypes: [mockListType],
                    listLanguage: [mockListLanguage],
                },
                displayError: false,
            };
            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('subscription-confirmation-preview', expectedData);

            return subscriptionConfirmationPreviewController.removePendingSubscription(request, response).then(() => {
                responseMock.verify();
            });
        });
    });
});
