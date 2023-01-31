import sinon from 'sinon';
import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import MediaAccountRejectionController from '../../../main/controllers/MediaAccountRejectionController';
import { MediaAccountApplicationService } from '../../../main/service/mediaAccountApplicationService';
import { cloneDeep } from 'lodash';
const mediaAccountRejectionController = new MediaAccountRejectionController();

const mediaAccountApplicationStub = sinon.stub(MediaAccountApplicationService.prototype, 'getApplicationByIdAndStatus');
const mediaAccountRejectionStub = sinon.stub(MediaAccountApplicationService.prototype, 'rejectApplication');
const i18n = {
    'media-account-rejection': {},
    'media-account-rejection-confirmation': {},
    error: {},
};

describe('Media Account Rejection Controller', () => {
    const applicantId = '1234';
    const status = 'PENDING';
    const adminUserId = '1234-1234-1234-1234';
    const dummyApplication = {
        id: '1234',
        fullName: 'Test Name',
        email: 'a@b.com',
        employer: 'Employer',
        image: '12345',
        imageName: 'ImageName.jpg',
        requestDate: '2022-05-09T00:00:01',
        status: 'PENDING',
        statusDate: '2022-05-09T00:00:01',
    };

    const response = {
        redirect: () => {
            return '';
        },
        render: () => {
            return '';
        },
        send: () => {
            return '';
        },
        set: () => {
            return '';
        },
    } as unknown as Response;

    it('should render media-account-rejection page when applicant ID sent and found', async () => {
        const responseMock = sinon.mock(response);

        const request = mockRequest(i18n);
        request['query'] = { applicantId: applicantId };

        mediaAccountApplicationStub.withArgs(applicantId, status).resolves(dummyApplication);

        responseMock
            .expects('render')
            .once()
            .withArgs('media-account-rejection', {
                ...cloneDeep(request.i18n.getDataByLanguage(request.lng)['media-account-rejection']),
                applicantData: dummyApplication,
            });

        await mediaAccountRejectionController.get(request, response);

        responseMock.verify();
    });

    it('should render error page when applicant not found', async () => {
        const responseMock = sinon.mock(response);

        const request = mockRequest(i18n);
        request['query'] = { applicantId: '1234' };

        mediaAccountApplicationStub.withArgs('1234', status).resolves(null);

        responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng)['error']);

        await mediaAccountRejectionController.get(request, response);

        responseMock.verify();
    });

    it('should render media-account-rejection-confirmation page if applicant found, approved, and successfully updated', async () => {
        const responseMock = sinon.mock(response);

        const request = mockRequest(i18n);
        request['body'] = {
            'reject-confirmation': 'Yes',
            applicantId: applicantId,
        };
        request['user'] = { userId: adminUserId };

        mediaAccountApplicationStub.withArgs(applicantId, status).resolves(dummyApplication);
        mediaAccountRejectionStub.withArgs(applicantId, adminUserId).resolves(dummyApplication);
        responseMock
            .expects('redirect')
            .once()
            .withArgs('/media-account-rejection-confirmation?applicantId=' + applicantId);

        await mediaAccountRejectionController.post(request, response);

        responseMock.verify();
    });

    it('should render error page if no applicant is found', async () => {
        const responseMock = sinon.mock(response);

        const request = mockRequest(i18n);
        request['body'] = { 'reject-confirmation': 'Yes' };

        mediaAccountApplicationStub.withArgs('1234', status).resolves(null);

        responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng)['error']);

        await mediaAccountRejectionController.post(request, response);

        responseMock.verify();
    });

    it('should render rejection page if applicant id found, but no radio button has been selected', async () => {
        const responseMock = sinon.mock(response);

        const request = mockRequest(i18n);
        request['body'] = { applicantId: applicantId };
        mediaAccountApplicationStub.withArgs(applicantId, status).resolves(dummyApplication);

        responseMock
            .expects('render')
            .once()
            .withArgs('media-account-rejection', {
                ...cloneDeep(request.i18n.getDataByLanguage(request.lng)['media-account-rejection']),
                applicantData: dummyApplication,
                displayRadioError: true,
            });

        await mediaAccountRejectionController.post(request, response);

        responseMock.verify();
    });

    it('should render media-account-review page if No approval is given', async () => {
        const responseMock = sinon.mock(response);

        const request = mockRequest(i18n);
        request['body'] = { 'reject-confirmation': 'No', applicantId: applicantId };

        mediaAccountApplicationStub.withArgs(applicantId, status).resolves(dummyApplication);

        responseMock
            .expects('redirect')
            .once()
            .withArgs('/media-account-review?applicantId=' + applicantId);

        await mediaAccountRejectionController.post(request, response);

        responseMock.verify();
    });

    it('should render error page if failed to update application when approval is given', async () => {
        const responseMock = sinon.mock(response);

        const request = mockRequest(i18n);
        request['body'] = {
            'reject-confirmation': 'Yes',
            applicantId: applicantId,
        };
        request['user'] = { userId: adminUserId };

        mediaAccountApplicationStub.withArgs(applicantId, status).resolves(dummyApplication);
        mediaAccountRejectionStub.withArgs(applicantId, adminUserId).resolves(null);

        responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng)['error']);

        await mediaAccountRejectionController.post(request, response);

        responseMock.verify();
    });
});
