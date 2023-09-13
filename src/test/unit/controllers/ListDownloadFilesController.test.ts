import ListDownloadFilesController from '../../../main/controllers/ListDownloadFilesController';
import sinon from 'sinon';
import fs from 'fs';
import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import { ListDownloadService } from '../../../main/service/listDownloadService';
import { PublicationService } from '../../../main/service/publicationService';
import { AccountManagementRequests } from '../../../main/resources/requests/accountManagementRequests';

const listDownloadFilesController = new ListDownloadFilesController();

const mockArtefact = {
    listType: 'SJP_PRESS_LIST',
    sensitivity: 'CLASSIFIED',
};

describe('List Download Files Controller', () => {
    const i18n = {
        'list-download-files': {},
        error: { title: 'error' },
        'unauthorised-access': { title: 'unauthorised' },
    };
    const url = 'list-download-files';

    const request = mockRequest(i18n);
    const response = {
        render: () => {
            return '';
        },
        send: () => {
            return '';
        },
        setHeader: () => {
            return '';
        },
    } as unknown as Response;

    sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(mockArtefact);
    const isAuthorisedStub = sinon.stub(AccountManagementRequests.prototype, 'isAuthorised');
    isAuthorisedStub.withArgs('1').resolves(true);
    isAuthorisedStub.withArgs('2').resolves(false);

    jest.mock('fs');

    afterAll(() => {
        sinon.restore();
    });

    describe('without file type', () => {
        const getFileSizeStub = sinon.stub(ListDownloadService.prototype, 'getFileSize');
        getFileSizeStub.withArgs('123', 'pdf').returns('650.0KB');
        getFileSizeStub.withArgs('123', 'xlsx').returns('200.0KB');

        getFileSizeStub.withArgs('124', 'pdf').returns('650.0KB');
        getFileSizeStub.withArgs('124', 'xlsx').returns(null);

        getFileSizeStub.withArgs('125', 'pdf').returns(null);
        getFileSizeStub.withArgs('125', 'xlsx').returns('200.0KB');

        request.user = { userId: '1' };

        it('should render the list download files page for both PDF and EXCEL', () => {
            request.query = { artefactId: '123' };
            const responseMock = sinon.mock(response);

            const expectedData = {
                ...i18n[url],
                artefactId: '123',
                pdfFileSize: '650.0KB',
                excelFileSize: '200.0KB',
            };
            responseMock.expects('render').once().withArgs(url, expectedData);

            listDownloadFilesController.get(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should render the list download files page for PDF only', () => {
            request.query = { artefactId: '124' };
            const responseMock = sinon.mock(response);

            const expectedData = {
                ...i18n[url],
                artefactId: '124',
                pdfFileSize: '650.0KB',
                excelFileSize: null,
            };
            responseMock.expects('render').once().withArgs(url, expectedData);

            listDownloadFilesController.get(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should render the list download files page for EXCEL only', () => {
            request.query = { artefactId: '125' };
            const responseMock = sinon.mock(response);

            const expectedData = {
                ...i18n[url],
                artefactId: '125',
                pdfFileSize: null,
                excelFileSize: '200.0KB',
            };
            responseMock.expects('render').once().withArgs(url, expectedData);

            listDownloadFilesController.get(request, response).then(() => {
                responseMock.verify();
            });
        });
    });

    describe('with file type', () => {
        const getFileStub = sinon.stub(ListDownloadService.prototype, 'getFile').returns('test.pdf');
        getFileStub.withArgs('123').returns('test.pdf');
        getFileStub.withArgs('124').returns('test.xlsx');
        getFileStub.withArgs('125').returns(null);

        sinon.stub(fs, 'createReadStream').returns({
            pipe: sinon.stub().returns({}),
        });

        request.user = { userId: '1' };

        it('should set response headers when downloading PDF', () => {
            request.query = { type: 'pdf', artefactId: '123' };
            const responseMock = sinon.mock(response);

            responseMock.expects('setHeader').once().withArgs('Content-disposition', 'attachment; filename=test.pdf');
            responseMock.expects('setHeader').once().withArgs('Content-type', 'application/pdf');

            listDownloadFilesController.get(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should set response headers when downloading Excel spreadsheet', () => {
            request.query = { type: 'excel', artefactId: '124' };
            const responseMock = sinon.mock(response);

            responseMock.expects('setHeader').once().withArgs('Content-disposition', 'attachment; filename=test.xlsx');
            responseMock
                .expects('setHeader')
                .once()
                .withArgs('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

            listDownloadFilesController.get(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should render the error page if no file returned', () => {
            request.query = { artefactId: '125', type: 'pdf' };
            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('error', i18n.error);

            listDownloadFilesController.get(request, response).then(() => {
                responseMock.verify();
            });
        });
    });

    describe('without artefact ID', () => {
        it('should render the error page', () => {
            request.query = {};
            request.user = { userId: '1' };
            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('error', i18n.error);

            listDownloadFilesController.get(request, response).then(() => {
                responseMock.verify();
            });
        });
    });

    describe('without the permission to view the page', () => {
        it('should render the unauthorised access page', () => {
            request.query = { artefactId: '999' };
            request.user = { userId: '2' };
            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('unauthorised-access', i18n['unauthorised-access']);

            listDownloadFilesController.get(request, response).then(() => {
                responseMock.verify();
            });
        });
    });
});
