import { Response } from 'express';
import { mockRequest } from '../../mocks/mockRequest';
import sinon from 'sinon';
import { ThirdPartyService } from '../../../../main/service/ThirdPartyService';
import ManageThirdPartySubscriptionsSummaryController from '../../../../main/controllers/system-admin/ManageThirdPartySubscriptionsSummaryController';
import { PublicationService } from '../../../../main/service/PublicationService';

const i18n = {
    'manage-third-party-subscriptions-summary': {
        title: 'Manage third-party subscriptions summary',
    },
    error: {
        title: 'Error',
    },
};

const response = {
    render: () => {
        return '';
    },
    redirect: () => {
        return '';
    },
    cookie: (cookieName, cookieValue) => {
        return cookieName + cookieValue;
    },
} as unknown as Response;

const userId = '123';
const userId2 = '124';
const userId3 = '125';
const adminUserId = '126';

const formCookie = {
    CIVIL_DAILY_CAUSE_LIST: 'Public',
    FAMILY_DAILY_CAUSE_LIST: 'Private',
};

const listTypeNameMap = new Map([
    ['Civil Daily Cause List', 'Public'],
    ['Family Daily Cause List', 'Private'],
]);

const thirdPartySubscriptions = [
    {
        userId: userId,
        listType: 'CIVIL_DAILY_CAUSE_LIST',
        sensitivity: 'PUBLIC',
    },
    {
        userId: userId,
        listType: 'FAMILY_DAILY_CAUSE_LIST',
        sensitivity: 'PRIVATE',
    },
];

const getThirdPartySubscriptionsStub = sinon.stub(ThirdPartyService.prototype, 'getThirdPartySubscriptionsByUserId');
getThirdPartySubscriptionsStub.withArgs(userId).resolves(thirdPartySubscriptions);
getThirdPartySubscriptionsStub.withArgs(userId2).resolves([]);
getThirdPartySubscriptionsStub.withArgs(userId3).resolves(thirdPartySubscriptions);

sinon.stub(PublicationService.prototype, 'getListTypes').returns(
    new Map([
        ['CIVIL_DAILY_CAUSE_LIST', { friendlyName: 'Civil Daily Cause List' }],
        ['FAMILY_DAILY_CAUSE_LIST', { friendlyName: 'Family Daily Cause List' }],
    ])
);

const updateThirdPartySubscriptionsStub = sinon.stub(ThirdPartyService.prototype, 'updateThirdPartySubscriptions');
updateThirdPartySubscriptionsStub.withArgs(sinon.match.any, userId, adminUserId).resolves(true);
updateThirdPartySubscriptionsStub.withArgs(sinon.match.any, userId3, adminUserId).resolves(false);

sinon.stub(ThirdPartyService.prototype, 'createThirdPartySubscriptions').resolves(true);

const manageThirdPartySubscriptionsSummaryController = new ManageThirdPartySubscriptionsSummaryController();

describe('Manage third-party subscriptions summary controller', () => {
    describe('GET request', () => {
        it('should render the manage third-party subscriptions summary page', async () => {
            const request = mockRequest(i18n);
            request.query = { userId: userId };
            request.user = { userId: adminUserId };
            request['cookies'] = { formCookie: JSON.stringify(formCookie) };

            const responseMock = sinon.mock(response);

            const expectedOptions = {
                title: 'Manage third-party subscriptions summary',
                listTypeNameMap,
                userId: userId,
            };

            responseMock
                .expects('render')
                .once()
                .withArgs('system-admin/manage-third-party-subscriptions-summary', expectedOptions);

            await manageThirdPartySubscriptionsSummaryController.get(request, response);
            responseMock.verify();
        });

        it('should render the error page if no user ID supplied', async () => {
            const request = mockRequest(i18n);
            request.user = { userId: adminUserId };
            request['cookies'] = { formCookie: JSON.stringify(formCookie) };
            const responseMock = sinon.mock(response);

            responseMock.expects('render').once().withArgs('error', { title: 'Error' });

            await manageThirdPartySubscriptionsSummaryController.get(request, response);
            responseMock.verify();
        });
    });

    describe('POST request', () => {
        it('should redirect to manage third-party subscriptions updated success page if there are existing subscriptions', async () => {
            const request = mockRequest(i18n);
            request.body = { userId: userId };
            request.user = { userId: adminUserId };
            request.cookies = { formCookie: JSON.stringify(formCookie) };

            const responseMock = sinon.mock(response);

            responseMock.expects('redirect').once().withArgs('/manage-third-party-subscriptions-updated-success');

            await manageThirdPartySubscriptionsSummaryController.post(request, response);
            responseMock.verify();
        });

        it('should redirect to manage third-party subscriptions created success page if no existing subscriptions', async () => {
            const request = mockRequest(i18n);
            request.body = { userId: userId2 };
            request.user = { userId: adminUserId };
            request.cookies = { formCookie: JSON.stringify(formCookie) };

            const responseMock = sinon.mock(response);

            responseMock.expects('redirect').once().withArgs('/manage-third-party-subscriptions-created-success');

            await manageThirdPartySubscriptionsSummaryController.post(request, response);
            responseMock.verify();
        });

        it('should render the manage third-party subscriptions summary page with error if request failed', async () => {
            const request = mockRequest(i18n);
            request.body = { userId: userId3 };
            request.user = { userId: adminUserId };
            request.cookies = { formCookie: JSON.stringify(formCookie) };

            const responseMock = sinon.mock(response);

            const expectedOptions = {
                title: 'Manage third-party subscriptions summary',
                listTypeNameMap,
                userId: userId3,
                requestError: true,
            };

            responseMock
                .expects('render')
                .once()
                .withArgs('system-admin/manage-third-party-subscriptions-summary', expectedOptions);

            await manageThirdPartySubscriptionsSummaryController.post(request, response);
            responseMock.verify();
        });
    });
});
