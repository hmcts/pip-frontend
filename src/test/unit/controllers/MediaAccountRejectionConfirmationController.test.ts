import MediaAccountRejectionConfirmationController from '../../../main/controllers/MediaAccountRejectionConfirmationController';
import { MediaAccountApplicationService } from '../../../main/service/mediaAccountApplicationService';
import sinon from 'sinon';
import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';

const mediaAccountRejectionConfirmationController = new MediaAccountRejectionConfirmationController();

describe('Media Account Rejection Confirmation Controller', () => {
    describe('GET request', () => {
        const url = 'media-account-rejection-confirmation';
        const i18n = {
            url: {},
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
                ...i18n[url],
                applicantData: applicantData,
                reasons: undefined,
            };

            responseMock.expects('render').once().withArgs(url, expectedData);
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
