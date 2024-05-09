import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import sinon from 'sinon';
import CreateThirdPartyUserController from '../../../main/controllers/CreateThirdPartyUserController';
import { ThirdPartyService } from '../../../main/service/ThirdPartyService';

const generalThirdPartyFormData = { thirdPartyName: 'name', thirdPartyRole: 'GENERAL_THIRD_PARTY' };
const verifiedThirdPartyFormData = { thirdPartyName: 'name', thirdPartyRole: 'VERIFIED_THIRD_PARTY_ALL' };

const i18n = {
    'create-third-party-user': {
        title: 'Create third party user',
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

const userRoleList = [
    {
        value: 'GENERAL_THIRD_PARTY',
        text: 'General third party',
        checked: true,
        hint: {
            text: 'User allowed access to public and private publications only',
        },
    },
    {
        value: 'VERIFIED_THIRD_PARTY_ALL',
        text: 'Verified third party - All',
        checked: true,
        hint: {
            text: 'User allowed access to classified publications for all list types',
        },
    },
];

const formErrors = {
    userNameError: true,
    userRoleError: false,
};

sinon.stub(ThirdPartyService.prototype, 'buildThirdPartyRoleList').returns(userRoleList);

const validateThirdPartyStub = sinon.stub(ThirdPartyService.prototype, 'validateThirdPartyUserFormFields');
validateThirdPartyStub.withArgs(generalThirdPartyFormData).returns(formErrors);
validateThirdPartyStub.withArgs(verifiedThirdPartyFormData).returns(null);

const createThirdPartyUserController = new CreateThirdPartyUserController();

describe('Create third party user controller', () => {
    describe('GET request', () => {
        it('should render the create third party user page', async () => {
            const responseMock = sinon.mock(response);

            const expectedOptions = {
                ...i18n['create-third-party-user'],
                userRoleList: userRoleList,
                formData: generalThirdPartyFormData,
            };

            responseMock.expects('render').once().withArgs('create-third-party-user', expectedOptions);

            await createThirdPartyUserController.get(request, response);
            responseMock.verify();
        });
    });

    describe('POST request', () => {
        it('should render the create third party user page with errors', async () => {
            request.body = generalThirdPartyFormData;
            const responseMock = sinon.mock(response);

            const expectedOptions = {
                ...i18n['create-third-party-user'],
                userRoleList: userRoleList,
                formData: generalThirdPartyFormData,
                formErrors: formErrors,
            };

            responseMock.expects('render').once().withArgs('create-third-party-user', expectedOptions);

            await createThirdPartyUserController.post(request, response);
            responseMock.verify();
        });

        it('should redirect to create third party user summary page', async () => {
            request.body = verifiedThirdPartyFormData;
            const responseMock = sinon.mock(response);

            responseMock.expects('redirect').once().withArgs('/create-third-party-user-summary');

            await createThirdPartyUserController.post(request, response);
            responseMock.verify();
        });
    });
});
