import sinon from 'sinon';
import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import SubscriptionAddListController from '../../../main/controllers/SubscriptionAddListController';
import {SubscriptionService} from "../../../main/service/SubscriptionService";

const userId = '1';
const userProvenance = 'PI_AAD';
const language = 'en';
const subscriptionAddListController = new SubscriptionAddListController();

const generateListTypeForCourtsStub = sinon.stub(SubscriptionService.prototype, 'generateListTypeForCourts');
const createListTypeStub = sinon.stub(SubscriptionService.prototype, 'createListTypeSubscriptionPayload');

generateListTypeForCourtsStub.withArgs(userProvenance, language, userId).resolves([]);
createListTypeStub.withArgs('').resolves([]);
createListTypeStub.withArgs('test').resolves('[test]');

const i18n = { 'subscription-add-list': {} };
const response = {
    render: () => {
        return '';
    },
    redirect: () => {
        return '';
    },
} as unknown as Response;

describe('Add Location List Subscriptions Controller', () => {
    describe('GET view', () => {
        it('should render the Add Location List subscription page without error', () => {
            const request = mockRequest(i18n);
            request.user = { userId: userId, userProvenance: userProvenance };
            request.query = { error: 'false' };
            request.lng = language;

            const expectedData = {
                ...i18n['subscription-add-list'],
                listTypes: [],
                noSelectionError: false,
            };
            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('subscription-add-list', expectedData);

            return subscriptionAddListController.get(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should render the Add Location List subscription page with error', () => {
            const request = mockRequest(i18n);
            request.user = { userId: userId, userProvenance: userProvenance };
            request.query = { error: 'true' };
            request.lng = language;

            const expectedData = {
                ...i18n['subscription-add-list'],
                listTypes: [],
                noSelectionError: true,
            };
            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('subscription-add-list', expectedData);

            return subscriptionAddListController.get(request, response).then(() => {
                responseMock.verify();
            });
        });
    });
});
