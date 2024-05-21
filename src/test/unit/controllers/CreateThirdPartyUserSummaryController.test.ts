import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import sinon from 'sinon';
import { ThirdPartyService } from '../../../main/service/ThirdPartyService';
import CreateThirdPartyUserSummaryController from '../../../main/controllers/CreateThirdPartyUserSummaryController';

const formData = {
    thirdPartyName: 'name',
    thirdPartyRoleObject: { name: 'General third party' },
};

const i18n = {
    'create-third-party-user-summary': {
        title: 'Create third party user summary',
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

const createThirdPartyStub = sinon.stub(ThirdPartyService.prototype, 'createThirdPartyUser');
createThirdPartyStub.withArgs(formData, '1').resolves(null);
createThirdPartyStub.withArgs(formData, '2').resolves('true');

const createThirdPartyUserSummaryController = new CreateThirdPartyUserSummaryController();

describe('Create third party user summary controller', () => {
    describe('GET request', () => {
        it('should render the create third party user summary page', async () => {
            request.user = { userId: '1' };
            const responseMock = sinon.mock(response);

            const expectedOptions = {
                ...i18n['create-third-party-user-summary'],
                formData: formData,
                displayError: false,
            };

            responseMock.expects('render').once().withArgs('create-third-party-user-summary', expectedOptions);

            await createThirdPartyUserSummaryController.get(request, response);
            responseMock.verify();
        });
    });

    describe('POST request', () => {
        it('should render the create third party user summary page with errors', async () => {
            request.user = { userId: '1' };
            const responseMock = sinon.mock(response);

            const expectedOptions = {
                ...i18n['create-third-party-user-summary'],
                formData: formData,
                displayError: true,
            };

            responseMock.expects('render').once().withArgs('create-third-party-user-summary', expectedOptions);

            await createThirdPartyUserSummaryController.post(request, response);
            responseMock.verify();
        });

        it('should redirect to create third party user success page', async () => {
            request.user = { userId: '2' };
            const responseMock = sinon.mock(response);

            responseMock.expects('redirect').once().withArgs('/create-third-party-user-success');

            await createThirdPartyUserSummaryController.post(request, response);
            responseMock.verify();
        });
    });
});
