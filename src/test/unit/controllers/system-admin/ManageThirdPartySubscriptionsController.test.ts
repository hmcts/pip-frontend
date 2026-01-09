import { Response } from 'express';
import { mockRequest } from '../../mocks/mockRequest';
import sinon from 'sinon';
import { ThirdPartyService } from '../../../../main/service/ThirdPartyService';
import ManageThirdPartySubscriptionsController from '../../../../main/controllers/system-admin/ManageThirdPartySubscriptionsController';

const i18n = {
    'manage-third-party-subscriptions': {
        title: 'Manage third-party subscriptions',
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
const adminUserId = '124';

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
const testListTypeSensitivityMapping = 'test-mapping';

sinon.stub(ThirdPartyService.prototype, 'getThirdPartySubscriptionsByUserId').resolves(thirdPartySubscriptions);
sinon.stub(ThirdPartyService.prototype, 'constructListTypeSensitivityMappings').returns(testListTypeSensitivityMapping);

const manageThirdPartySubscriptionsController = new ManageThirdPartySubscriptionsController();

describe('Manage third-party subscriptions controller', () => {
    describe('GET request', () => {
        it('should render the manage third-party subscriptions page', async () => {
            const request = mockRequest(i18n);
            request.query = { userId: userId };
            request.user = { userId: adminUserId };

            const responseMock = sinon.mock(response);

            const expectedOptions = {
                title: 'Manage third-party subscriptions',
                subscriptions: thirdPartySubscriptions,
                listTypeSensitivityMapping: testListTypeSensitivityMapping,
                userId: userId,
            };

            responseMock
                .expects('render')
                .once()
                .withArgs('system-admin/manage-third-party-subscriptions', expectedOptions);

            await manageThirdPartySubscriptionsController.get(request, response);
            responseMock.verify();
        });

        it('should render the error page if no user ID supplied', async () => {
            const request = mockRequest(i18n);
            request.user = { userId: adminUserId };

            const responseMock = sinon.mock(response);

            responseMock.expects('render').once().withArgs('error', { title: 'Error' });

            await manageThirdPartySubscriptionsController.get(request, response);
            responseMock.verify();
        });
    });

    describe('POST request', () => {
        it('should redirect to manage third-party subscriptions summary page', async () => {
            const formData = {
                userId: userId,
                CIVIL_DAILY_CAUSE_LIST: 'Private',
                FAMILY_DAILY_CAUSE_LIST: 'Classified',
            };

            const request = mockRequest(i18n);
            request.body = formData;
            request['cookies'] = { formCookie: JSON.stringify(formData) };

            const responseMock = sinon.mock(response);

            responseMock.expects('redirect').once().withArgs(`/manage-third-party-subscriptions-summary?userId=123`);

            await manageThirdPartySubscriptionsController.post(request, response);
            responseMock.verify();
        });
    });
});
