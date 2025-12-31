import { Response } from 'express';
import { mockRequest } from '../../mocks/mockRequest';
import sinon from 'sinon';
import { ThirdPartyService } from '../../../../main/service/ThirdPartyService';
import CreateThirdPartySubscriberSummaryController from '../../../../main/controllers/system-admin/CreateThirdPartySubscriberSummaryController';

const formData = {
    thirdPartySubscriberName: 'name',
};

const i18n = {
    'create-third-party-subscriber-summary': {
        title: 'Create third party subscriber summary',
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

const request = mockRequest(i18n);
request['cookies'] = { formCookie: JSON.stringify(formData) };

const createThirdPartySubscriberStub = sinon.stub(ThirdPartyService.prototype, 'createThirdPartySubscriber');
createThirdPartySubscriberStub.withArgs(formData, '1').resolves(null);
createThirdPartySubscriberStub.withArgs(formData, '2').resolves('true');

const createThirdPartySubscriberSummaryController = new CreateThirdPartySubscriberSummaryController();

describe('Create third party subscriber summary controller', () => {
    describe('GET request', () => {
        it('should render the create third party subscriber summary page', async () => {
            request.user = { userId: '1' };
            const responseMock = sinon.mock(response);

            const expectedOptions = {
                ...i18n['create-third-party-subscriber-summary'],
                formData: formData,
                displayError: false,
            };

            responseMock
                .expects('render')
                .once()
                .withArgs('system-admin/create-third-party-subscriber-summary', expectedOptions);

            await createThirdPartySubscriberSummaryController.get(request, response);
            responseMock.verify();
        });
    });

    describe('POST request', () => {
        it('should render the create third party subscriber summary page with errors', async () => {
            request.user = { userId: '1' };
            const responseMock = sinon.mock(response);

            const expectedOptions = {
                ...i18n['create-third-party-subscriber-summary'],
                formData: formData,
                displayError: true,
            };

            responseMock
                .expects('render')
                .once()
                .withArgs('system-admin/create-third-party-subscriber-summary', expectedOptions);

            await createThirdPartySubscriberSummaryController.post(request, response);
            responseMock.verify();
        });

        it('should redirect to create third party subscriber success page', async () => {
            request.user = { userId: '2' };
            const responseMock = sinon.mock(response);

            responseMock.expects('redirect').once().withArgs('/create-third-party-subscriber-success');

            await createThirdPartySubscriberSummaryController.post(request, response);
            responseMock.verify();
        });
    });
});
