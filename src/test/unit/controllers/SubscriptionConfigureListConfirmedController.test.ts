import sinon from 'sinon';
import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import SubscriptionConfigureListConfirmedController from '../../../main/controllers/SubscriptionConfigureListConfirmedController';
import { SubscriptionService } from '../../../main/service/SubscriptionService';
import {PendingSubscriptionsFromCache} from "../../../main/service/PendingSubscriptionsFromCache";

const subscriptionConfigureListConfirmedController = new SubscriptionConfigureListConfirmedController();

const stub = sinon.stub(SubscriptionService.prototype, 'configureListTypeForLocationSubscriptions');
const cacheStub = sinon.stub(PendingSubscriptionsFromCache.prototype, 'getPendingSubscriptions');
cacheStub.withArgs('1', 'listTypes').resolves(['CIVIL_DAILY_CAUSE_LIST']);

stub.withArgs('1', ['CIVIL_DAILY_CAUSE_LIST'], ['ENGLISH']).returns(true);
stub.withArgs(null, ['CIVIL_DAILY_CAUSE_LIST']).returns(false);

const response = {
    render: function () {
        return '';
    },
} as unknown as Response;

describe('Subscription Configure List Type Confirmed', () => {
    const i18n = {};
    it('should render the confirmation page', () => {
        const request = mockRequest(i18n);
        request.user = { userId: '1' };
        request.body = { 'list-language': 'ENGLISH' };
        const responseMock = sinon.mock(response);

        const expectedData = {
            ...i18n['subscription-configure-list-confirmed'],
        };

        responseMock.expects('render').once().withArgs('subscription-configure-list-confirmed', expectedData);

        return subscriptionConfigureListConfirmedController.post(request, response).then(() => {
            responseMock.verify();
        });
    });

    it('should render an error page if list type subscription is not updated', () => {
        const request = mockRequest(i18n);
        request.user = { userId: null };
        request.body = { 'list-language': 'ENGLISH' };

        const responseMock = sinon.mock(response);

        responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

        return subscriptionConfigureListConfirmedController.post(request, response).then(() => {
            responseMock.verify();
        });
    });
});
