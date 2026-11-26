import { Response } from 'express';
import { mockRequest } from '../../mocks/mockRequest';
import sinon from 'sinon';
import EditUserCommunicationSummaryController from '../../../../main/controllers/system-admin/EditUserCommunicationSummaryController';
import { UserCommunicationManagementService } from '../../../../main/service/UserCommunicationManagementService';
import { UserManagementService } from '../../../../main/service/UserManagementService';
import { expect } from 'chai';

const editUserCommunicationSummaryController = new EditUserCommunicationSummaryController();

const i18n = {
    'edit-user-communication-summary': {
        title: 'Edit Summary',
        confirmButton: 'Confirm',
    },
};

describe('Edit user communication summary controller', () => {
    let request;
    let response;

    beforeEach(() => {
        request = mockRequest(i18n);
        request.user = { userId: '123' };
        response = {
            render: () => {
                return '';
            },
            redirect: () => {
                return '';
            },
        } as unknown as Response;
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('get', () => {
        it('should render the edit user communication summary page', async () => {
            request.cookies = { formCookie: JSON.stringify({ bannerMessage: 'test', userCommunicationId: '123' }) };
            const responseMock = sinon.mock(response);

            sinon.stub(UserCommunicationManagementService.prototype, 'getTableHeaders').returns(['header1']);
            sinon.stub(UserCommunicationManagementService.prototype, 'fetchUserCommunicationSummary').returns([['data1']]);

            responseMock.expects('render').once().withArgs('system-admin/edit-user-communication-summary', sinon.match.any);

            await editUserCommunicationSummaryController.get(request, response);
            responseMock.verify();
        });
    });

    describe('post', () => {
        it('should redirect to success page on successful update', async () => {
            const formData = { bannerMessage: 'test', userCommunicationId: '123', typeOfCommunication: 'ALL_USERS' };
            request.cookies = { formCookie: JSON.stringify(formData) };
            request.query = {}; // No ID in query
            const responseMock = sinon.mock(response);

            const updateStub = sinon.stub(UserCommunicationManagementService.prototype, 'updateUserCommunication').resolves(true);
            sinon.stub(UserManagementService.prototype, 'auditAction').resolves();

            responseMock.expects('redirect').once().withArgs('/edit-user-communication-success');

            await editUserCommunicationSummaryController.post(request, response);

            expect(updateStub.calledWith(formData, '123', '123')).to.be.true;
            responseMock.verify();
        });

        it('should render error if update fails', async () => {
             const formData = { bannerMessage: 'test', userCommunicationId: '123', typeOfCommunication: 'ALL_USERS' };
            request.cookies = { formCookie: JSON.stringify(formData) };
            request.query = {};
            const responseMock = sinon.mock(response);

            sinon.stub(UserCommunicationManagementService.prototype, 'updateUserCommunication').resolves(false);

            responseMock.expects('render').once().withArgs('system-admin/edit-user-communication-summary', sinon.match.has('displayError', true));

            await editUserCommunicationSummaryController.post(request, response);
            responseMock.verify();
        });
    });
});
