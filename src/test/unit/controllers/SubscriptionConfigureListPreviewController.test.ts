import sinon from 'sinon';
import { Response } from 'express';
import { SubscriptionService } from '../../../main/service/SubscriptionService';
import { mockRequest } from '../mocks/mockRequest';
import { PendingSubscriptionsFromCache } from '../../../main/service/PendingSubscriptionsFromCache';
import SubscriptionConfigureListPreviewController from '../../../main/controllers/SubscriptionConfigureListPreviewController';

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
const queryParams = { 'list-type': mockListTypeValue };
const userWithSubscriptions = '1';
const userWithNoSubscriptions = '2';
const userRemoveListTypeSubscription = '3';
const userWithMultipleSubscriptions = '4';
const userEmptyListTypeSubscription = '5';
const subscriptionConfigureListPreviewController = new SubscriptionConfigureListPreviewController();
const handleSubStub = sinon.stub(SubscriptionService.prototype, 'handleNewSubscription');
const subscriptionStub = sinon.stub(SubscriptionService.prototype, 'getPendingSubscriptions');
const cacheStub = sinon.stub(PendingSubscriptionsFromCache.prototype, 'getPendingSubscriptions');
const subscribeStub = sinon.stub(SubscriptionService.prototype, 'configureListTypeForLocationSubscriptions');
const friendlyNameStub = sinon.stub(SubscriptionService.prototype, 'findListTypeFriendlyName');
const removeListTypeSub = sinon.stub(SubscriptionService.prototype, 'removeListTypeForCourt');
const removeFromCacheSub = sinon.stub(SubscriptionService.prototype, 'removeFromCache');

removeFromCacheSub.withArgs(queryParams, userRemoveListTypeSubscription).resolves(true);

subscriptionStub.withArgs(userWithSubscriptions, 'cases').resolves([]);
subscriptionStub.withArgs(userWithSubscriptions, 'courts').resolves([]);
subscriptionStub.withArgs(userWithSubscriptions, 'listTypes').resolves([mockListTypeValue]);
subscriptionStub.withArgs(userWithSubscriptions, 'listLanguage').resolves([mockListLanguage]);

cacheStub.withArgs(userWithSubscriptions, 'cases').resolves([]);
cacheStub.withArgs(userWithSubscriptions, 'courts').resolves([]);
cacheStub.withArgs(userWithSubscriptions, 'listTypes').resolves([mockListTypeValue]);
cacheStub.withArgs(userWithSubscriptions, 'listLanguage').resolves([mockListLanguage]);

subscriptionStub.withArgs(userWithNoSubscriptions, 'cases').resolves([]);
subscriptionStub.withArgs(userWithNoSubscriptions, 'courts').resolves([]);
subscriptionStub.withArgs(userWithNoSubscriptions, 'listTypes').resolves([]);
subscriptionStub.withArgs(userWithNoSubscriptions, 'listLanguage').resolves([]);

cacheStub.withArgs(userWithNoSubscriptions, 'cases').resolves([]);
cacheStub.withArgs(userWithNoSubscriptions, 'courts').resolves([]);
cacheStub.withArgs(userWithNoSubscriptions, 'listTypes').resolves([]);
cacheStub.withArgs(userWithNoSubscriptions, 'listLanguage').resolves([]);

subscriptionStub.withArgs(userRemoveListTypeSubscription, 'cases').resolves([]);
subscriptionStub.withArgs(userRemoveListTypeSubscription, 'courts').resolves([]);
subscriptionStub.withArgs(userRemoveListTypeSubscription, 'listTypes').resolves([mockListTypeValue]);
subscriptionStub.withArgs(userRemoveListTypeSubscription, 'listLanguage').resolves([mockListLanguage]);

cacheStub.withArgs(userRemoveListTypeSubscription, 'cases').resolves([]);
cacheStub.withArgs(userRemoveListTypeSubscription, 'courts').resolves([]);
cacheStub.withArgs(userRemoveListTypeSubscription, 'listTypes').resolves([mockListTypeValue]);
cacheStub.withArgs(userRemoveListTypeSubscription, 'listLanguage').resolves([mockListLanguage]);

subscriptionStub.withArgs(userEmptyListTypeSubscription, 'cases').resolves([]);
subscriptionStub.withArgs(userEmptyListTypeSubscription, 'courts').resolves([]);
subscriptionStub.withArgs(userEmptyListTypeSubscription, 'listTypes').resolves([]);
subscriptionStub.withArgs(userEmptyListTypeSubscription, 'listLanguage').resolves([]);

cacheStub.withArgs(userEmptyListTypeSubscription, 'cases').resolves([]);
cacheStub.withArgs(userEmptyListTypeSubscription, 'courts').resolves([]);
cacheStub.withArgs(userEmptyListTypeSubscription, 'listTypes').resolves([]);
cacheStub.withArgs(userEmptyListTypeSubscription, 'listLanguage').resolves([]);

subscriptionStub.withArgs(userWithMultipleSubscriptions, 'cases').resolves([]);
subscriptionStub.withArgs(userWithMultipleSubscriptions, 'courts').resolves([]);
subscriptionStub.withArgs(userWithMultipleSubscriptions, 'listTypes').resolves([mockListTypeValue, mockListTypeValue2]);
subscriptionStub.withArgs(userWithMultipleSubscriptions, 'listLanguage').resolves([mockListLanguage]);

handleSubStub.withArgs(postData, userWithSubscriptions).resolves(true);

subscribeStub.withArgs(userWithSubscriptions).resolves(true);
subscribeStub.withArgs(userRemoveListTypeSubscription).resolves(false);

friendlyNameStub.withArgs(mockListTypeValue).resolves(mockListTypeText);
friendlyNameStub.withArgs(mockListTypeValue2).resolves(mockListTypeText2);

removeListTypeSub.withArgs('PI_AAD', 'en', userRemoveListTypeSubscription).resolves(true);

const i18n = {
    'subscription-configure-list-preview': {},
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

describe('Subscription Configure List Preview Controller', () => {
    describe('GET view', () => {
        it('should render the Subscription Configure List Preview page with list type subscription', () => {
            const request = mockRequest(i18n);
            request.user = { userId: userWithSubscriptions };
            request.lng = 'en';
            const expectedData = {
                ...i18n['subscription-configure-list-preview'],
                pendingSubscriptions: {
                    cases: [],
                    courts: [],
                    listTypes: [mockListType],
                    listLanguage: [mockListLanguage],
                },
                displayError: false,
            };
            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('subscription-configure-list-preview', expectedData);

            return subscriptionConfigureListPreviewController.get(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should render Subscription Configure List Preview page with error summary', () => {
            const request = mockRequest(i18n);
            request.user = { userId: userWithNoSubscriptions };
            request.query = { 'no-list-configure': 'true' };
            const expectedData = {
                ...i18n['subscription-configure-list-preview'],
                pendingSubscriptions: {
                    cases: [],
                    courts: [],
                    listTypes: [],
                    listLanguage: [],
                },
                displayError: true,
            };
            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('subscription-configure-list-preview', expectedData);

            return subscriptionConfigureListPreviewController.get(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should render Subscription Configure List Preview page with multiple subscriptions', () => {
            const request = mockRequest(i18n);
            request.user = { userId: userWithMultipleSubscriptions };
            const expectedData = {
                ...i18n['subscription-configure-list-preview'],
                pendingSubscriptions: {
                    cases: [],
                    courts: [],
                    listTypes: [mockListType, mockListType2],
                    listLanguage: [mockListLanguage],
                },
                displayError: false,
            };
            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('subscription-configure-list-preview', expectedData);

            return subscriptionConfigureListPreviewController.get(request, response).then(() => {
                responseMock.verify();
            });
        });
    });

    describe('POST view', () => {
        it('should redirect to confirmed page if subscribed successfully', () => {
            const request = mockRequest(i18n);
            request.user = { userId: userWithSubscriptions };

            const responseMock = sinon.mock(response);
            responseMock.expects('redirect').once().withArgs('/subscription-configure-list-confirmed');

            return subscriptionConfigureListPreviewController.post(request, response).then(() => {
                responseMock.verify();
            });
        });
    });

    describe('removeConfigureList view', () => {
        it('should render Subscription Configure List Preview page on removeConfigureList call', () => {
            const request = mockRequest(i18n);
            request.user = { userId: userRemoveListTypeSubscription, userProvenance: 'PI_AAD' };
            request.lng = 'en';
            request.query = queryParams;
            const expectedData = {
                ...i18n['subscription-configure-list-preview'],
                pendingSubscriptions: {
                    cases: [],
                    courts: [],
                    listTypes: [mockListType],
                    listLanguage: [mockListLanguage],
                },
            };
            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('subscription-configure-list-preview', expectedData);

            return subscriptionConfigureListPreviewController.removeConfigureList(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should render Subscription Configure List Preview page with error', () => {
            const request = mockRequest(i18n);
            request.user = { userId: userEmptyListTypeSubscription, userProvenance: 'PI_AAD' };
            request.lng = 'en';
            request.query = queryParams;

            const responseMock = sinon.mock(response);
            responseMock
                .expects('redirect')
                .once()
                .withArgs('subscription-configure-list-preview?no-list-configure=true');

            return subscriptionConfigureListPreviewController.removeConfigureList(request, response).then(() => {
                responseMock.verify();
            });
        });
    });
});
