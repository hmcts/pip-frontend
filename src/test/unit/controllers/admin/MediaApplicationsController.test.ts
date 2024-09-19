import sinon from 'sinon';
import { MediaAccountApplicationService } from '../../../../main/service/MediaAccountApplicationService';
import { Response } from 'express';
import { mockRequest } from '../../mocks/mockRequest';
import MediaApplicationsController from '../../../../main/controllers/admin/MediaApplicationsController';

sinon.stub(MediaAccountApplicationService.prototype, 'getDateOrderedMediaApplications').resolves([]);
const mediaApplications = new MediaApplicationsController();
describe('Media application assessment controller', () => {
    const i18n = {
        'media-applications': {},
    };
    const response = {
        render: () => {
            return '';
        },
    } as unknown as Response;
    const request = mockRequest(i18n);

    it('should render with media applications', async () => {
        const expectedData = {
            ...i18n['media-applications'],
            mediaApplications: [],
        };
        const responseMock = sinon.mock(response);
        responseMock.expects('render').once().withArgs('admin/media-applications', expectedData);

        await mediaApplications.get(request, response);
        responseMock.verify();
    });
});
