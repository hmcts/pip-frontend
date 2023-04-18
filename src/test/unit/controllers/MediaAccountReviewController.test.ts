import MediaAccountReviewController from '../../../main/controllers/MediaAccountReviewController';
import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import sinon from 'sinon';
import { MediaAccountApplicationService } from '../../../main/service/mediaAccountApplicationService';
import { cloneDeep } from 'lodash';

const i18n = { 'media-account-review': {}, error: {} };
const mediaAccountApplicationStub = sinon.stub(MediaAccountApplicationService.prototype, 'getApplicationByIdAndStatus');
const mediaAccountApplicationByIdOnlyStub = sinon.stub(MediaAccountApplicationService.prototype, 'getApplicationById');
const mediaAccountApplicationImageStub = sinon.stub(MediaAccountApplicationService.prototype, 'getImageById');

describe('Media Account Review Controller Test', () => {
    const applicantId = '1234';
    const imageId = '12345';
    const status = 'PENDING';

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

    const dummyApplicationAllCapsFileType = {
        id: '1234',
        fullName: 'Test Name',
        email: 'a@b.com',
        employer: 'Employer',
        image: '12345',
        imageName: 'ImageName.JPG',
        requestDate: '2022-05-09T00:00:01',
        status: 'PENDING',
        statusDate: '2022-05-09T00:00:01',
    };

    const dummyApplicationMixedCapsFileType = {
        id: '1234',
        fullName: 'Test Name',
        email: 'a@b.com',
        employer: 'Employer',
        image: '12345',
        imageName: 'ImageName.JpG',
        requestDate: '2022-05-09T00:00:01',
        status: 'PENDING',
        statusDate: '2022-05-09T00:00:01',
    };

    const dummyApplicationWithUnknownImageType = {
        id: '1234',
        fullName: 'Test Name',
        email: 'a@b.com',
        employer: 'Employer',
        image: '12345',
        imageName: 'ImageName.unknown',
        requestDate: '2022-05-09T00:00:01',
        status: 'PENDING',
        statusDate: '2022-05-09T00:00:01',
    };

    const dummyImage = new Blob(['testJPEG']);
    const mediaAccountReviewController = new MediaAccountReviewController();
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

    it('should render media account review page when applicant id provided', async () => {
        const responseMock = sinon.mock(response);

        const request = mockRequest(i18n);
        request['query'] = { applicantId: applicantId };

        mediaAccountApplicationStub.withArgs(applicantId, status).resolves(dummyApplication);

        responseMock
            .expects('render')
            .once()
            .withArgs('media-account-review', {
                ...cloneDeep(request.i18n.getDataByLanguage(request.lng)['media-account-review']),
                applicantData: dummyApplication,
            });

        await mediaAccountReviewController.get(request, response);

        responseMock.verify();
    });

    it('should render media account review page when image type is in all caps', async () => {
        const responseMock = sinon.mock(response);

        const request = mockRequest(i18n);
        request['query'] = { applicantId: applicantId };

        mediaAccountApplicationStub.withArgs(applicantId, status).resolves(dummyApplicationAllCapsFileType);

        responseMock
            .expects('render')
            .once()
            .withArgs('media-account-review', {
                ...cloneDeep(request.i18n.getDataByLanguage(request.lng)['media-account-review']),
                applicantData: dummyApplicationAllCapsFileType,
            });

        await mediaAccountReviewController.get(request, response);

        responseMock.verify();
    });

    it('should render media account review page when image type is in mixed caps', async () => {
        const responseMock = sinon.mock(response);

        const request = mockRequest(i18n);
        request['query'] = { applicantId: applicantId };

        mediaAccountApplicationStub.withArgs(applicantId, status).resolves(dummyApplicationMixedCapsFileType);

        responseMock
            .expects('render')
            .once()
            .withArgs('media-account-review', {
                ...cloneDeep(request.i18n.getDataByLanguage(request.lng)['media-account-review']),
                applicantData: dummyApplicationMixedCapsFileType,
            });

        await mediaAccountReviewController.get(request, response);

        responseMock.verify();
    });

    it('should render error page when applicant provided but does not exist', async () => {
        const responseMock = sinon.mock(response);

        const request = mockRequest(i18n);
        request['query'] = { applicantId: applicantId };

        mediaAccountApplicationStub.withArgs(applicantId, status).resolves(null);

        responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng)['error']);

        await mediaAccountReviewController.get(request, response);

        responseMock.verify();
    });

    it('should render image when applicant id and image id provided', async () => {
        const responseMock = sinon.mock(response);

        const request = mockRequest(i18n);
        request['query'] = { applicantId: applicantId, imageId: imageId };

        mediaAccountApplicationByIdOnlyStub.withArgs(applicantId).resolves(dummyApplication);
        mediaAccountApplicationImageStub.withArgs(imageId).resolves(dummyImage);

        responseMock.expects('set').once().withArgs('Content-Disposition', 'inline;filename=ImageName.jpg');
        responseMock.expects('set').once().withArgs('Content-Type', 'image/jpeg');
        responseMock.expects('send').once().withArgs(dummyImage);

        await mediaAccountReviewController.getImage(request, response);

        responseMock.verify();
    });

    it('should render error when applicant does not exist when getting image', async () => {
        const responseMock = sinon.mock(response);

        const request = mockRequest(i18n);
        request['query'] = { applicantId: applicantId, imageId: imageId };

        mediaAccountApplicationByIdOnlyStub.withArgs(applicantId).resolves(null);

        responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng)['error']);
        await mediaAccountReviewController.getImage(request, response);

        responseMock.verify();
    });

    it('should render error when image does not exist', async () => {
        const responseMock = sinon.mock(response);

        const request = mockRequest(i18n);
        request['query'] = { applicantId: applicantId, imageId: imageId };

        mediaAccountApplicationByIdOnlyStub.withArgs(applicantId).resolves(dummyApplication);
        mediaAccountApplicationImageStub.withArgs(imageId).resolves(null);

        responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng)['error']);
        await mediaAccountReviewController.getImage(request, response);

        responseMock.verify();
    });

    it('should render error when image is not one of the expected types', async () => {
        const responseMock = sinon.mock(response);

        const request = mockRequest(i18n);
        request['query'] = { applicantId: applicantId, imageId: imageId };

        mediaAccountApplicationByIdOnlyStub.withArgs(applicantId).resolves(dummyApplicationWithUnknownImageType);
        mediaAccountApplicationImageStub.withArgs(imageId).resolves(dummyImage);

        responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng)['error']);
        await mediaAccountReviewController.getImage(request, response);

        responseMock.verify();
    });

    it('should render success page when applicant id provided', async () => {
        const responseMock = sinon.mock(response);

        const request = mockRequest(i18n);
        request['body'] = { applicantId: applicantId };

        responseMock
            .expects('redirect')
            .once()
            .withArgs('/media-account-approval?applicantId=' + applicantId);
        await mediaAccountReviewController.approve(request, response);

        responseMock.verify();
    });

    it('should render error page when applicant id not provided on success', async () => {
        const responseMock = sinon.mock(response);

        const request = mockRequest(i18n);

        responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng)['error']);
        await mediaAccountReviewController.approve(request, response);

        responseMock.verify();
    });

    it('should render rejection page when applicant id provided', async () => {
        const responseMock = sinon.mock(response);

        const request = mockRequest(i18n);
        request['body'] = { applicantId: applicantId };

        responseMock
            .expects('redirect')
            .once()
            .withArgs('/media-account-rejection-reasons?applicantId=' + applicantId);
        await mediaAccountReviewController.reject(request, response);

        responseMock.verify();
    });

    it('should render error page when applicant id not provided on rejection', async () => {
        const responseMock = sinon.mock(response);

        const request = mockRequest(i18n);

        responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng)['error']);
        await mediaAccountReviewController.reject(request, response);

        responseMock.verify();
    });
});
