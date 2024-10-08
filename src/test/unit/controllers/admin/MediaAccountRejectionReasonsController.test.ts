import MediaAccountRejectionReasonsController from '../../../../main/controllers/admin/MediaAccountRejectionReasonsController';
import { MediaAccountApplicationService } from '../../../../main/service/MediaAccountApplicationService';
import sinon from 'sinon';
import { Response } from 'express';
import { mockRequest } from '../../mocks/mockRequest';
import { cloneDeep } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

const mediaAccountRejectionReasonsController = new MediaAccountRejectionReasonsController();
import rejectReasons from '../../../../main/resources/media-account-rejection-reasons-lookup.json';

describe('Media Account Rejection Reasons Controller', () => {
    const applicantId = uuidv4();
    const i18n = {
        'media-account-rejection-reasons': {},
        error: {},
    };

    const applicantData = {
        fullName: 'test user',
        email: 'test@test.com',
        employer: 'HMCTS',
    };
    const getApplicationStub = sinon.stub(MediaAccountApplicationService.prototype, 'getApplicationById');
    describe('GET request', () => {
        it('should render the media account rejection reasons page', () => {
            getApplicationStub.withArgs(applicantId).resolves(applicantData);

            const response = {
                render: () => {
                    return '';
                },
            } as unknown as Response;
            const responseMock = sinon.mock(response);

            const request = mockRequest(i18n);
            request.query = { applicantId: applicantId };

            const { getDataByLanguage } = request.i18n;
            const expectedData = {
                ...cloneDeep(getDataByLanguage(request.lng)['media-account-rejection-reasons']),
                applicantId: applicantId,
                rejectReasons,
                showError: false,
            };

            responseMock.expects('render').once().withArgs('admin/media-account-rejection-reasons', expectedData);
            mediaAccountRejectionReasonsController.get(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should render the error page if no applicant ID', () => {
            const applicantId = '';
            const response = {
                render: () => {
                    return '';
                },
            } as unknown as Response;
            const responseMock = sinon.mock(response);

            const request = mockRequest(i18n);
            request.query = { applicantId };
            responseMock.expects('render').once().withArgs('error', i18n.error);
            mediaAccountRejectionReasonsController.get(request, response).then(() => {
                responseMock.verify();
            });
        });
    });
    describe('POST requests', () => {
        const mediaAccountApplicationStub = sinon.stub(
            MediaAccountApplicationService.prototype,
            'getApplicationByIdAndStatus'
        );
        it('should return a valid response with valid applicantId and valid reasons', () => {
            const request = mockRequest(i18n);
            const applicantId = 'validApplicantId';
            mediaAccountApplicationStub.withArgs(applicantId, 'PENDING').resolves(applicantData);
            const reasons = ['noMatch', 'expired'];
            request.body = {
                'rejection-reasons': reasons,
                applicantId,
            };
            const response = {
                render: () => {
                    return '';
                },
            } as unknown as Response;
            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('admin/media-account-rejection', {
                applicantData,
                applicantId,
                reasons,
            });
            mediaAccountRejectionReasonsController.post(request, response).then(() => {
                responseMock.verify();
            });
        });
        it('should return a valid response with invalid applicantId and invalid reasons', () => {
            const request = mockRequest(i18n);
            const response = {
                render: () => {
                    return '';
                },
            } as unknown as Response;
            const { getDataByLanguage } = request.i18n;
            const expectedData = {
                ...cloneDeep(getDataByLanguage(request.lng)['media-account-rejection-reasons']),
                applicantId: undefined,
                rejectReasons,
                showError: true,
            };

            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('admin/media-account-rejection-reasons', expectedData);
            mediaAccountRejectionReasonsController.post(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should return an invalid response with valid applicantId and invalid reasons', () => {
            const request = mockRequest(i18n);
            const response = {
                render: () => {
                    return '';
                },
            } as unknown as Response;
            const responseMock = sinon.mock(response);
            request.body = {
                applicantId,
            };
            const { getDataByLanguage } = request.i18n;
            const expectedData = {
                ...cloneDeep(getDataByLanguage(request.lng)['media-account-rejection-reasons']),
                applicantId: applicantId,
                rejectReasons,
                showError: true,
            };
            responseMock.expects('render').once().withArgs('admin/media-account-rejection-reasons', expectedData);
            mediaAccountRejectionReasonsController.post(request, response).then(() => {
                responseMock.verify();
            });
        });
    });
});
