import MediaAccountApprovalConfirmationController from '../../../../main/controllers/admin/MediaAccountApprovalConfirmationController';
import { MediaAccountApplicationService } from '../../../../main/service/MediaAccountApplicationService';
import sinon from 'sinon';
import { Response } from 'express';
import { mockRequest } from '../../mocks/mockRequest';

const mediaAccountApprovalConfirmationController = new MediaAccountApprovalConfirmationController();

describe('Media Account Approval Confirmation Controller', () => {
    describe('GET request', () => {
        const i18n = {
            'media-account-approval-confirmation': {},
            error: {},
        };

        const applicantId = '123-456';
        const applicantData = {
            fullName: 'test user',
            email: 'test@test.com',
            employer: 'HMCTS',
        };
        const getApplicationStub = sinon.stub(MediaAccountApplicationService.prototype, 'getApplicationById');

        it('should render the media account approval confirmation page', () => {
            getApplicationStub.withArgs(applicantId).resolves(applicantData);

            const response = {
                render: () => {
                    return '';
                },
            } as unknown as Response;
            const responseMock = sinon.mock(response);

            const request = mockRequest(i18n);
            request.query = { applicantId: applicantId };

            const expectedData = {
                ...i18n['media-account-approval-confirmation'],
                applicantData: applicantData,
            };

            responseMock.expects('render').once().withArgs('admin/media-account-approval-confirmation', expectedData);
            mediaAccountApprovalConfirmationController.get(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should render the error page if no applicant ID', () => {
            getApplicationStub.withArgs(applicantId).resolves(applicantData);

            const response = {
                render: () => {
                    return '';
                },
            } as unknown as Response;
            const responseMock = sinon.mock(response);

            const request = mockRequest(i18n);

            responseMock.expects('render').once().withArgs('error', i18n.error);
            mediaAccountApprovalConfirmationController.get(request, response).then(() => {
                responseMock.verify();
            });
        });
    });
});
