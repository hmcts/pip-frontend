import ListDownloadFilesController from '../../../main/controllers/ListDownloadFilesController';
import sinon from 'sinon';
import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import { ListDownloadService } from '../../../main/service/ListDownloadService';
import { PublicationService } from '../../../main/service/PublicationService';
import { AccountManagementRequests } from '../../../main/resources/requests/AccountManagementRequests';
import { HttpStatusCode } from 'axios';

const listDownloadFilesController = new ListDownloadFilesController();

const mockArtefact1 = {
    artefactId: '123',
    listType: 'SJP_PRESS_LIST',
    sensitivity: 'CLASSIFIED',
};

const mockArtefact2 = {
    artefactId: '124',
    listType: 'SJP_PRESS_LIST',
    sensitivity: 'CLASSIFIED',
};

const mockArtefact3 = {
    artefactId: '125',
    listType: 'SJP_PRESS_LIST',
    sensitivity: 'CLASSIFIED',
};

const publicationMetaDataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
publicationMetaDataStub.withArgs('123').resolves(mockArtefact1);
publicationMetaDataStub.withArgs('124').resolves(mockArtefact2);
publicationMetaDataStub.withArgs('125').resolves(mockArtefact3);
publicationMetaDataStub.withArgs('999').resolves(HttpStatusCode.NotFound);

const isAuthorisedStub = sinon.stub(AccountManagementRequests.prototype, 'isAuthorised');
isAuthorisedStub.withArgs('1').resolves(true);
isAuthorisedStub.withArgs('2').resolves(false);

const getFileSizeStub = sinon.stub(ListDownloadService.prototype, 'getFileSize');
getFileSizeStub.withArgs('123', 'pdf').returns('650.0KB');
getFileSizeStub.withArgs('123', 'xlsx').returns('200.0KB');

getFileSizeStub.withArgs('124', 'pdf').returns('650.0KB');
getFileSizeStub.withArgs('124', 'xlsx').returns(null);

getFileSizeStub.withArgs('125', 'pdf').returns(null);
getFileSizeStub.withArgs('125', 'xlsx').returns('200.0KB');

const getFileStub = sinon.stub(ListDownloadService.prototype, 'getFile');
getFileStub.withArgs('123').returns('abc');
getFileStub.withArgs('124').returns('def');
getFileStub.withArgs('125').returns(null);

sinon.stub(ListDownloadService.prototype, 'handleFileDownload');

describe('List Download Files Controller', () => {
    const i18n = {
        'list-download-files': {},
        error: { title: 'error' },
        'unauthorised-access': { title: 'unauthorised' },
        'list-not-found': { title: 'not found' },
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

    describe('without file type', () => {
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
        request.user = { userId: '1' };

        it('should set response headers when downloading PDF', () => {
            request.query = { type: 'pdf', artefactId: '123' };
            const responseMock = sinon.mock(response);

            responseMock.expects('setHeader').once().withArgs('Content-disposition', 'attachment; filename=123.pdf');
            responseMock.expects('setHeader').once().withArgs('Content-type', 'application/pdf');

            listDownloadFilesController.get(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should set response headers when downloading Excel spreadsheet', () => {
            request.query = { type: 'excel', artefactId: '124' };
            const responseMock = sinon.mock(response);

            responseMock.expects('setHeader').once().withArgs('Content-disposition', 'attachment; filename=124.xlsx');
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

    describe('artefact does not exist', () => {
        it('should render the list not found page', () => {
            request.query = { artefactId: '999' };
            request.user = { userId: '1' };
            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('list-not-found', i18n['list-not-found']);

            listDownloadFilesController.get(request, response).then(() => {
                responseMock.verify();
            });
        });
    });

    describe('without the permission to view the page', () => {
        it('should render the unauthorised access page', () => {
            request.query = { artefactId: '123' };
            request.user = { userId: '2' };
            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('unauthorised-access', i18n['unauthorised-access']);

            listDownloadFilesController.get(request, response).then(() => {
                responseMock.verify();
            });
        });
    });
});
