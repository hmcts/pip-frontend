import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import { SubscriptionService } from '../../../main/service/subscriptionService';
import sinon from 'sinon';
import SubscriptionConfigureListController from '../../../main/controllers/SubscriptionConfigureListController';
import { FilterService } from '../../../main/service/filterService';

const subscriptionConfigureListController = new SubscriptionConfigureListController();

describe('Subscriptions Configure List Controller', () => {
    const i18n = {
        'subscription-configure-list': {},
    };
    it('should render subscription configure list page on get request', () => {
        const response = {
            render: function () {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);

        request.user = { userId: '1234', userProvenance: 'userProvenance' };
        request.query = { filterValues: 'filterValue', clear: 'Civil' };

        sinon
            .stub(SubscriptionService.prototype, 'generateListTypesForCourts')
            .withArgs('1234', 'userProvenance', 'filterValue', 'Civil', 'en')
            .resolves({ listOptions: { A: {} }, filterOptions: { AB: {} } });

        const responseMock = sinon.mock(response);
        responseMock
            .expects('render')
            .once()
            .withArgs('subscription-configure-list', {
                ...i18n['subscription-configure-list'],
                listTypes: { A: {} },
                filterOptions: { AB: {} },
            });

        return subscriptionConfigureListController.get(request, response).then(() => {
            responseMock.verify();
        });
    });

    it('should redirect to configure list page with correct filters', () => {
        const response = {
            redirect: function () {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.body = { testKey: 'testBody' };

        sinon.stub(FilterService.prototype, 'generateFilterKeyValues').withArgs(request.body).returns('TestValue');

        const responseMock = sinon.mock(response);
        responseMock.expects('redirect').once().withArgs('subscription-configure-list?filterValues=TestValue');

        return subscriptionConfigureListController.filterValues(request, response).then(() => {
            responseMock.verify();
        });
    });
});
