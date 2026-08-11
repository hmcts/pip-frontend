import { mockRequest } from '../mocks/mockRequest';
import { Response } from 'express';
import sinon from 'sinon';
import PublishingPolicyController from '../../../main/controllers/PublishingPolicyController';

const publishingPolicyController = new PublishingPolicyController();

describe('Publishing Policy Page controller', () => {
    it('should render publishing policy page', async () => {
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest({ 'publishing-policy': {} });
        const responseMock = sinon.mock(response);

        responseMock
            .expects('render')
            .once()
            .withArgs('publishing-policy', request.i18n.getDataByLanguage(request.lng)['publishing-policy']);
        await publishingPolicyController.get(request, response);
        await responseMock.verify();
    });
});

