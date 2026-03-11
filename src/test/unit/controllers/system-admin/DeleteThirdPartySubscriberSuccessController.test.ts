import { Response } from 'express';
import { mockRequest } from '../../mocks/mockRequest';
import sinon from 'sinon';
import DeleteThirdPartySubscriberSuccessController from '../../../../main/controllers/system-admin/DeleteThirdPartySubscriberSuccessController';

const i18n = {
    'delete-third-party-subscriber-success': {
        title: 'Delete third-party subscriber success',
    },
};

const response = {
    render: () => {
        return '';
    },
} as unknown as Response;

const request = mockRequest(i18n);

const deleteThirdPartySubscriberSuccessController = new DeleteThirdPartySubscriberSuccessController();

describe('Delete third-party subscriber success controller', () => {
    it('should render the delete third-party subscriber success page', async () => {
        const responseMock = sinon.mock(response);
        responseMock
            .expects('render')
            .once()
            .withArgs(
                'system-admin/delete-third-party-subscriber-success',
                i18n['delete-third-party-subscriber-success']
            );

        await deleteThirdPartySubscriberSuccessController.get(request, response);
        responseMock.verify();
    });
});
