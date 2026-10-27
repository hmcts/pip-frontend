import { Response } from 'express';
import { mockRequest } from '../../mocks/mockRequest';
import sinon from 'sinon';
import DeleteUserSuccessController from '../../../../main/controllers/system-admin/DeleteUserSuccessController';


const i18n = {
    'delete-user-success': {
        title: 'Delete third party user success',
    },
};

const request = mockRequest(i18n);

const response = {
    render: () => {
        return '';
    },
} as unknown as Response;

const deleteThirdPartyUserSuccessController = new DeleteUserSuccessController();

describe('Delete user success controller', () => {
    it('should render the create third party user success page', async () => {
        const responseMock = sinon.mock(response);
        responseMock.expects('render').once()
            .withArgs('system-admin/delete-user-success',  {
                ...i18n['delete-user-success'],
            });

        await deleteThirdPartyUserSuccessController.get(request, response);
        responseMock.verify();
    });
});
