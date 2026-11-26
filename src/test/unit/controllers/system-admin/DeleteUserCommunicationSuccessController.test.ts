import { Response } from 'express';
import { mockRequest } from '../../mocks/mockRequest';
import sinon from 'sinon';
import DeleteUserCommunicationSuccessController from '../../../../main/controllers/system-admin/DeleteUserCommunicationSuccessController';

const deleteUserCommunicationSuccessController = new DeleteUserCommunicationSuccessController();

const i18n = {
    'delete-user-communication-success': {
        title: 'Delete Success',
    },
};

describe('Delete user communication success controller', () => {
    let request;
    let response;

    beforeEach(() => {
        request = mockRequest(i18n);
        response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should render the delete user communication success page', async () => {
        const responseMock = sinon.mock(response);

        responseMock.expects('render').once().withArgs('system-admin/delete-user-communication-success', i18n['delete-user-communication-success']);

        await deleteUserCommunicationSuccessController.get(request, response);
        responseMock.verify();
    });
});
