import MediaAccountRejectionReasonsController from '../../../main/controllers/MediaAccountRejectionReasonsController';
import { MediaAccountApplicationService } from '../../../main/service/mediaAccountApplicationService';
import sinon from 'sinon';
import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import { cloneDeep } from 'lodash';

const mediaAccountRejectionReasonsController = new MediaAccountRejectionReasonsController();

describe('Media Account Rejection Reasons Controller', () => {
    const applicantId = '123-456';
    // const suffix = 'media-account-rejection-reasons?applicantId=123-456';
    const url = 'media-account-rejection-reasons';
    const i18n = {
        url,
        error: {},
    };
    const rejectReasons = {
        notMedia: [
            'The applicant is not an accredited member of the media.',
            'You can sign in with an existing MyHMCTS account. Or you can register your organisation at https://www.gov.uk/guidance/myhmcts-online-case-management-for-legal-professionals',
        ],
        expired: ['ID provided has expired or is not a press ID.', 'Please provide a valid Press ID.'],
        noMatch: ['Details provided do not match.', 'The name, email address and Press ID do not match each other.'],
    };
    const applicantData = {
        fullName: 'test user',
        email: 'test@test.com',
        employer: 'HMCTS',
    };
    const getApplicationStub = sinon.stub(MediaAccountApplicationService.prototype, 'getApplicationById');
    describe('GET request', () => {
        it('should render the media account rejection confirmation page', () => {
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
                ...cloneDeep(getDataByLanguage(request.lng)[url]),
                applicantId: '123-456',
                rejectReasons,
            };

            responseMock.expects('render').once().withArgs(url, expectedData);
            mediaAccountRejectionReasonsController.get(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should render the error page if no applicant ID', () => {
            const applicantId = null;
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
            const reasons = ['reason1', 'reason2'];
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
            responseMock.expects('render').once().withArgs('media-account-rejection', {
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

            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('error', {});
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
            responseMock.expects('render').once().withArgs('error', {});
            mediaAccountRejectionReasonsController.post(request, response).then(() => {
                responseMock.verify();
            });
        });
    });
});
