import { Response } from 'express';
import { mockRequest } from '../../mocks/mockRequest';
import sinon from 'sinon';
import CreateThirdPartySubscriberController from '../../../../main/controllers/system-admin/CreateThirdPartySubscriberController';
import { ThirdPartyService } from '../../../../main/service/ThirdPartyService';

const generalThirdPartyFormData = { thirdPartySubscriberName: 'name' };
const generalThirdPartyFormDataWithError = { thirdPartySubscriberName: '' };

const i18n = {
    'create-third-party-subscriber': {
        title: 'Create third-party subscriber',
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
request['cookies'] = { formCookie: JSON.stringify(generalThirdPartyFormData) };

const formErrors = {
    userNameError: true,
};

const validateThirdPartyStub = sinon.stub(ThirdPartyService.prototype, 'validateThirdPartySubscriberFormFields');
validateThirdPartyStub.withArgs(generalThirdPartyFormDataWithError).returns(formErrors);
validateThirdPartyStub.withArgs(generalThirdPartyFormData).returns(null);

const createThirdPartySubscriberController = new CreateThirdPartySubscriberController();

describe('Create third-party subscriber controller', () => {
    describe('GET request', () => {
        it('should render the create third-party subscriber page', async () => {
            const responseMock = sinon.mock(response);

            const expectedOptions = {
                ...i18n['create-third-party-subscriber'],
                formData: generalThirdPartyFormData,
            };

            responseMock
                .expects('render')
                .once()
                .withArgs('system-admin/create-third-party-subscriber', expectedOptions);

            await createThirdPartySubscriberController.get(request, response);
            responseMock.verify();
        });
    });

    describe('POST request', () => {
        it('should render the create third-party subscriber page with errors', async () => {
            request.body = generalThirdPartyFormDataWithError;
            const responseMock = sinon.mock(response);

            const expectedOptions = {
                ...i18n['create-third-party-subscriber'],
                formData: generalThirdPartyFormDataWithError,
                formErrors: formErrors,
            };

            responseMock
                .expects('render')
                .once()
                .withArgs('system-admin/create-third-party-subscriber', expectedOptions);

            await createThirdPartySubscriberController.post(request, response);
            responseMock.verify();
        });

        it('should redirect to create third-party subscriber summary page', async () => {
            request.body = generalThirdPartyFormData;
            const responseMock = sinon.mock(response);

            responseMock.expects('redirect').once().withArgs('/create-third-party-subscriber-summary');

            await createThirdPartySubscriberController.post(request, response);
            responseMock.verify();
        });
    });
});
