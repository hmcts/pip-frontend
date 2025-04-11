import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import { SubscriptionService } from '../../../main/service/SubscriptionService';
import sinon from 'sinon';
import SubscriptionConfigureListController from '../../../main/controllers/SubscriptionConfigureListController';

const subscriptionConfigureListController = new SubscriptionConfigureListController();

const userId = '1';
const userProvenance = 'PI_AAD';
const language = 'en';

const generateListTypeStub = sinon.stub(SubscriptionService.prototype, 'generateListTypesForCourts');
const createListTypeStub = sinon.stub(SubscriptionService.prototype, 'createListTypeSubscriptionPayload');

generateListTypeStub
    .withArgs(userId, userProvenance, 'en')
    .resolves({ listOptions: { A: {} }, filterOptions: { AB: {} } });
createListTypeStub.withArgs('').resolves([]);
createListTypeStub.withArgs('test').resolves(['test']);

const response = {
    render: () => {
        return '';
    },
    redirect: () => {
        return '';
    },
} as unknown as Response;

const i18n = {
    'subscription-configure-list': {},
};

describe('Subscriptions Configure List Controller', () => {
    it('should render subscription configure list page on get request', () => {
        const response = {
            render: function () {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);

        request.user = { userId: userId, userProvenance: userProvenance };
        request.query = { filterValues: 'filterValue', clear: 'Civil' };

        const responseMock = sinon.mock(response);
        responseMock
            .expects('render')
            .once()
            .withArgs('subscription-configure-list', {
                ...i18n['subscription-configure-list'],
                listTypes: { A: {} },
            });

        return subscriptionConfigureListController.get(request, response).then(() => {
            responseMock.verify();
        });
    });

    describe('POST view', () => {
        it('should render subscription config List if post data is provided', () => {
            const request = mockRequest(i18n);
            request.user = { userId: userId, userProvenance: userProvenance };
            request.lng = language;
            request.body = { 'list-selections[]': 'test' };

            const responseMock = sinon.mock(response);
            responseMock.expects('redirect').once().withArgs('subscription-configure-list-language');

            return subscriptionConfigureListController.post(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should render subscription config List with error if post data is provided and no selection was select', () => {
            const request = mockRequest(i18n);
            request.user = { userId: userId, userProvenance: userProvenance };
            request.lng = language;
            const expectedData = {
                ...i18n['subscription-configure-list'],
                listTypes: { A: {} },
                noSelectionError: true,
            };
            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('subscription-configure-list', expectedData);

            return subscriptionConfigureListController.post(request, response).then(() => {
                responseMock.verify();
            });
        });
    });
});
