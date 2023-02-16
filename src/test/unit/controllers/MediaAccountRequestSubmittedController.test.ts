import sinon from 'sinon';
import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import MediaAccountRequestSubmittedController from '../../../main/controllers/MediaAccountRequestSubmittedController';

const requestSubmitted = new MediaAccountRequestSubmittedController();

describe('Media Account Request Submitted Controller', () => {
    const i18n = { 'account-request-submitted': {} };
    const response = {
        render: () => {
            return '';
        },
    } as unknown as Response;
    const request = mockRequest(i18n);

    it('should render success page', async () => {
        const responseMock = sinon.mock(response);
        responseMock
            .expects('render')
            .once()
            .withArgs(
                'account-request-submitted',
                request.i18n.getDataByLanguage(request.lng)['account-request-submitted']
            );

        await requestSubmitted.get(request, response);
        responseMock.verify();
    });
});
