import BulkCreateMediaAccountsConfirmedController from '../../../main/controllers/BulkCreateMediaAccountsConfirmedController';
import sinon from 'sinon';
import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';

const bulkCreateMediaAccountsConfirmedController = new BulkCreateMediaAccountsConfirmedController();
const url = 'bulk-create-media-accounts-confirmed';
const i18n = { url: {} };
const response = {
    render: () => {
        return '';
    },
} as unknown as Response;

describe('Bulk Create Media Accounts Confirmed Controller', () => {
    describe('GET request', () => {
        it('should render the bulk create media accounts confirmed page', () => {
            const responseMock = sinon.mock(response);
            const request = mockRequest(i18n);

            responseMock.expects('render').once().withArgs(url, i18n[url]);

            bulkCreateMediaAccountsConfirmedController.get(request, response).then(() => {
                responseMock.verify();
            });
        });
    });
});
