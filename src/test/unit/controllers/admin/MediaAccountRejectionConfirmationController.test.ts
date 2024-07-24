import MediaAccountRejectionConfirmationController from '../../../../main/controllers/admin/MediaAccountRejectionConfirmationController';
import { MediaAccountApplicationService } from '../../../../main/service/MediaAccountApplicationService';
import sinon from 'sinon';
import { Response } from 'express';
import { mockRequest } from '../../mocks/mockRequest';

const mediaAccountRejectionConfirmationController = new MediaAccountRejectionConfirmationController();

describe('Media Account Rejection Confirmation Controller', () => {
    describe('GET request', () => {
        const i18n = {
            admin: {
                'media-account-rejection-confirmation': {},
            },
            error: {},
        };

        const applicantId = '123-456';
        const applicantData = {
            fullName: 'test user',
            email: 'test@test.com',
            employer: 'HMCTS',
        };
        const getApplicationStub = sinon.stub(MediaAccountApplicationService.prototype, 'getApplicationById');

        it('should render the media account rejection confirmation page', () => {
            getApplicationStub.withArgs(applicantId).resolves(applicantData);

            const response = {
                render: () => {
                    return '';
                },
            } as unknown as Response;
            const responseMock = sinon.mock(response);

            const request = mockRequest(i18n);
            request.body = { applicantId: applicantId };

            const expectedData = {
                ...i18n['admin']['media-account-rejection-confirmation'],
                applicantData: applicantData,
                reasons: undefined,
            };

            responseMock.expects('render').once().withArgs('admin/media-account-rejection-confirmation', expectedData);
            mediaAccountRejectionConfirmationController.get(request, response).then(() => {
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
            mediaAccountRejectionConfirmationController.get(request, response).then(() => {
                responseMock.verify();
            });
        });
    });
});
