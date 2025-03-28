import { Response } from 'express';
import { mockRequest } from '../../mocks/mockRequest';
import sinon from 'sinon';
import BlobViewJsonController from '../../../../main/controllers/system-admin/BlobViewJsonController';
import { PublicationService } from '../../../../main/service/PublicationService';
import { LocationService } from '../../../../main/service/LocationService';
import { HttpStatusCode } from 'axios';

const blobViewController = new BlobViewJsonController();
const i18n = {
    'blob-view-json': {},
    'error' : { title: 'Error' }
};
const artefactJson = JSON.parse('{"Test":true}');
const artefactJsonString = JSON.stringify(artefactJson);
const jsonStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson');
const metaStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
const courtStub = sinon.stub(LocationService.prototype, 'getLocationById');
const meta = {
    artefactId: '1234',
    displayFrom: '2022-06-29T14:45:18.836',
    locationId: '1',
    name: 'hi',
    listType: 'SJP_PUBLIC_LIST',
};
jsonStub.withArgs('5678').resolves(HttpStatusCode.NotFound);

describe('Blob view publication controller', () => {
    describe('GET request', () => {
        it('should correctly render if location is passed and ref data exists', async () => {
            const jsonData = JSON.parse('{"name":"Single Justice Procedure"}');
            courtStub.withArgs(1).resolves(jsonData);
            jsonStub.withArgs('1234').resolves(artefactJson);
            metaStub.withArgs('1234', 10).resolves(meta);
            const response = {
                render: () => {
                    return '';
                },
            } as unknown as Response;
            const request = mockRequest(i18n);
            request.query = { artefactId: '1234' };
            request.user = { userId: 10 };

            const responseMock = sinon.mock(response);

            const expectedData = {
                ...i18n['blob-view-json'],
                data: artefactJsonString,
                locationName: 'Single Justice Procedure',
                artefactId: '1234',
                metadata: meta,
                listUrl: 'https://localhost:8080/sjp-public-list?artefactId=1234',
                noMatchArtefact: false,
            };
            responseMock.expects('render').once().withArgs('system-admin/blob-view-json', expectedData);
            await blobViewController.get(request, response);
            responseMock.verify;
        });

        it('should render a court name of No match artefacts if location ID includes NoMatch', async () => {
            jsonStub.withArgs('1234', 10).resolves(artefactJson);

            const metaWithNoMatch = {
                artefactId: '1234',
                displayFrom: '2022-06-29T14:45:18.836',
                locationId: 'NoMatch1',
                name: 'hi',
                listType: 'SJP_PUBLIC_LIST',
            };

            metaStub.withArgs('1234', 10).resolves(metaWithNoMatch);

            const response = {
                render: () => {
                    return '';
                },
            } as unknown as Response;

            const expectedData = {
                ...i18n['blob-view-json'],
                data: artefactJsonString,
                locationName: 'No match artefacts',
                artefactId: '1234',
                metadata: metaWithNoMatch,
                listUrl: 'https://localhost:8080/sjp-public-list?artefactId=1234',
                noMatchArtefact: true,
            };

            const responseMock = sinon.mock(response);
            const request = mockRequest(i18n);
            request.query = { artefactId: '1234' };
            request.user = { userId: 10 };

            responseMock.expects('render').once().withArgs('system-admin/blob-view-json', expectedData);
            await blobViewController.get(request, response);
            responseMock.verify;
        });

        it('should render the error screen if no artefact ID has been passed through', async () => {
            const response = {
                render: () => {
                    return '';
                },
            } as unknown as Response;

            const request = mockRequest(i18n);
            request.user = { userId: 1 };
            request.query = {};
            const responseMock = sinon.mock(response);

            responseMock.expects('render').once().withArgs('error');
            await blobViewController.get(request, response);
            responseMock.verify;
        });

        it('should render the not found screen if an invalid artefact ID has been passed through', async () => {
            const response = {
                render: () => {
                    return '';
                },
            } as unknown as Response;

            const request = mockRequest(i18n);
            request.user = { userId: 1 };
            request.query = { artefactId: '5678' };
            const responseMock = sinon.mock(response);

            responseMock.expects('render').once().withArgs('list-not-found');
            await blobViewController.get(request, response);
            responseMock.verify;
        });
    });

    describe('POST request', () => {
        it('should redirect to blob view subscription resubmit confirmation page', async () => {
            const response = {
                redirect: () => {
                    return '';
                },
            } as unknown as Response;

            const request = mockRequest(i18n);
            request.query = { artefactId: '1234' };
            request.user = { userId: 10 };

            const responseMock = sinon.mock(response);
            responseMock
                .expects('redirect')
                .once()
                .withArgs('blob-view-subscription-resubmit-confirmation?artefactId=1234');
            await blobViewController.post(request, response);
            responseMock.verify;
        });

        it('should redirect to error page if no artefact ID', async () => {
            const response = {
                render: () => {
                    return '';
                },
            } as unknown as Response;

            const request = mockRequest(i18n);
            request.query = {};
            request.user = { userId: 10 };

            const responseMock = sinon.mock(response);
            responseMock
                .expects('render')
                .once()
                .withArgs('error', { title: 'Error' });
            await blobViewController.post(request, response);
            responseMock.verify;
        });
    });
});
