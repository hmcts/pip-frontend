import ListDownloadDisclaimerController from '../../../main/controllers/ListDownloadDisclaimerController';
import sinon from 'sinon';
import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import { v4 as uuidv4 } from 'uuid';

const listDownloadDisclaimerController = new ListDownloadDisclaimerController();

describe('List Download Disclaimer Controller', () => {
    const artefactId = uuidv4();

    const i18n = {
        'list-download-disclaimer': {},
        error: {},
    };

    const listDownloadDisclaimerUrl = 'list-download-disclaimer';
    const listDownloadFilesUrl = `list-download-files?artefactId=${artefactId}`;

    const request = mockRequest(i18n);
    const response = {
        render: () => {
            return '';
        },
        redirect: () => {
            return '';
        },
    } as unknown as Response;

    describe('GET request', () => {
        it('should render the list download disclaimer page', () => {
            request.query = { artefactId: artefactId };
            const responseMock = sinon.mock(response);

            const expectedData = {
                ...i18n[listDownloadDisclaimerUrl],
                artefactId: artefactId,
            };
            responseMock.expects('render').once().withArgs(listDownloadDisclaimerUrl, expectedData);

            listDownloadDisclaimerController.get(request, response).then(() => {
                responseMock.verify();
            });
        });
    });

    describe('POST request', () => {
        it('should render the list download disclaimer page with error if terms and conditions not agreed', () => {
            const responseMock = sinon.mock(response);
            request.query = { artefactId: artefactId };
            request.body = {};

            const expectedData = {
                ...i18n[listDownloadDisclaimerUrl],
                noAgreementError: true,
                artefactId: artefactId,
            };
            responseMock.expects('render').once().withArgs(listDownloadDisclaimerUrl, expectedData);

            listDownloadDisclaimerController.post(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should redirect to list download files page if terms and conditions agreed', () => {
            request.query = { artefactId: artefactId };
            request.body = { 'disclaimer-agreement': 'agree' };

            const responseMock = sinon.mock(response);
            responseMock.expects('redirect').once().withArgs(listDownloadFilesUrl);

            listDownloadDisclaimerController.post(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should render error if invalid UUID', () => {
            request.query = { artefactId: 'abcd' };
            request.body = { 'disclaimer-agreement': 'agree' };

            const renderResponse = {
                render: () => {
                    return '';
                },
            } as unknown as Response;

            const responseMock = sinon.mock(renderResponse);
            responseMock.expects('render').once().withArgs('error');

            listDownloadDisclaimerController.post(request, renderResponse).then(() => {
                responseMock.verify();
            });
        });

        it('should render error if no artefactId is provided', () => {
            request.body = { 'disclaimer-agreement': 'agree' };

            const renderResponse = {
                render: () => {
                    return '';
                },
            } as unknown as Response;

            const responseMock = sinon.mock(renderResponse);
            responseMock.expects('render').once().withArgs('error');

            listDownloadDisclaimerController.post(request, renderResponse).then(() => {
                responseMock.verify();
            });
        });

        it('should redirect to list download files page if terms and conditions agreed', () => {
            const responseMock = sinon.mock(response);
            request.query = { artefactId: artefactId };
            request.body = undefined;

            const expectedData = {
                ...i18n[listDownloadDisclaimerUrl],
                noAgreementError: true,
                artefactId: artefactId,
            };
            responseMock.expects('render').once().withArgs(listDownloadDisclaimerUrl, expectedData);

            listDownloadDisclaimerController.post(request, response).then(() => {
                responseMock.verify();
            });
        });
    });
});
