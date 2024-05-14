import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import sinon from 'sinon';
import DeleteThirdPartyUserSuccessController from '../../../main/controllers/DeleteThirdPartyUserSuccessController';

const i18n = {
    'delete-third-party-user-success': {
        title: 'Delete third party user success',
    },
};

const response = {
    render: () => {
        return '';
    },
} as unknown as Response;

const request = mockRequest(i18n);

const deleteThirdPartyUserSuccessController = new DeleteThirdPartyUserSuccessController();

describe('Delete third party user success controller', () => {
    it('should render the delete third party user success page', async () => {
        const responseMock = sinon.mock(response);
        responseMock
            .expects('render')
            .once()
            .withArgs('delete-third-party-user-success', i18n['delete-third-party-user-success']);

        await deleteThirdPartyUserSuccessController.get(request, response);
        responseMock.verify();
    });
});
