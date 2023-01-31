import MediaAccountReviewController from '../../../main/controllers/MediaAccountReviewController';
import { Response } from 'express';
import sinon from 'sinon';
import { mockRequest } from '../mocks/mockRequest';
import { MediaAccountApplicationService } from '../../../main/service/mediaAccountApplicationService';
import { dummyApplication } from '../../helpers/testConsts';

const i18n = { 'media-account-review': {}, error: {} };
const mediaAccountApplicationStub = sinon.stub(MediaAccountApplicationService.prototype, 'getApplicationById');
const mediaAccountApplicationImageStub = sinon.stub(MediaAccountApplicationService.prototype, 'getImageById');

describe('Media Account Review Controller Test', () => {
    const applicantId = '1234';
    const imageId = '12345';

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

    it('should render image when applicant id and image id provided', async () => {
        const responseMock = sinon.mock(response);

        const request = mockRequest(i18n);
        request['query'] = { applicantId: applicantId, imageId: imageId };

        mediaAccountApplicationStub.withArgs(applicantId).resolves(dummyApplication);
        mediaAccountApplicationImageStub.withArgs(imageId).resolves(dummyImage);

        responseMock.expects('set').once().withArgs('Content-Disposition', 'inline;filename=ImageName.jpg');
        responseMock.expects('set').once().withArgs('Content-Type', 'image/jpeg');
        responseMock.expects('send').once().withArgs(dummyImage);

        await mediaAccountReviewController.getImage(request, response);

        responseMock.verify();
    });

    it('should render error when applicant does not exist', async () => {
        const responseMock = sinon.mock(response);

        const request = mockRequest(i18n);
        request['query'] = { applicantId: applicantId, imageId: imageId };

        mediaAccountApplicationStub.withArgs(applicantId).resolves(null);

        responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng)['error']);
        await mediaAccountReviewController.getImage(request, response);

        responseMock.verify();
    });

    it('should render error when image does not exist', async () => {
        const responseMock = sinon.mock(response);

        const request = mockRequest(i18n);
        request['query'] = { applicantId: applicantId, imageId: imageId };

        mediaAccountApplicationStub.withArgs(applicantId).resolves(dummyApplication);
        mediaAccountApplicationImageStub.withArgs(imageId).resolves(null);

        responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng)['error']);
        await mediaAccountReviewController.getImage(request, response);

        responseMock.verify();
    });

    it('should render error when image is not one of the expected types', async () => {
        const responseMock = sinon.mock(response);

        const request = mockRequest(i18n);
        request['query'] = { applicantId: applicantId, imageId: imageId };

        mediaAccountApplicationStub.withArgs(applicantId).resolves(dummyApplicationWithUnknownImageType);
        mediaAccountApplicationImageStub.withArgs(imageId).resolves(dummyImage);

        responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng)['error']);
        await mediaAccountReviewController.getImage(request, response);

        responseMock.verify();
    });
});
