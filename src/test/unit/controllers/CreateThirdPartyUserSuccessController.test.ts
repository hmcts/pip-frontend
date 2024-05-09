import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import sinon from 'sinon';
import CreateThirdPartyUserSuccessController from '../../../main/controllers/CreateThirdPartyUserSuccessController';

const formData = {
    thirdPartyName: 'name',
    thirdPartyRoleObject: { name: 'General third party' },
};
const i18n = {
    'create-third-party-user-success': {
        title: 'Create third party user success',
    },
};

const response = {
    render: () => {
        return '';
    },
    cookie: (cookieName, cookieValue) => {
        return cookieName + cookieValue;
    },
} as unknown as Response;

const request = mockRequest(i18n);
request['cookies'] = { formCookie: JSON.stringify(formData) };

const createThirdPartyUserSuccessController = new CreateThirdPartyUserSuccessController();

describe('Create third party user success controller', () => {
    it('should render the create third party user success page', async () => {
        const responseMock = sinon.mock(response);
        const expectedOptions = {
            ...i18n['create-third-party-user-success'],
            formData: formData,
        };

        responseMock.expects('render').once().withArgs('create-third-party-user-success', expectedOptions);

        await createThirdPartyUserSuccessController.get(request, response);
        responseMock.verify();
    });
});
