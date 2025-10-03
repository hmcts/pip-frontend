import { Response } from 'express';
import { mockRequest } from '../../mocks/mockRequest';
import sinon from 'sinon';
import { LocationService } from '../../../../main/service/LocationService';
import BlobViewPublicationsController from '../../../../main/controllers/system-admin/BlobViewPublicationsController';
import fs from 'fs';
import path from 'path';
import { PublicationService } from '../../../../main/service/PublicationService';

const blobViewController = new BlobViewPublicationsController();
const i18n = {
    'blob-view-publications': {},
    error: { title: 'error' },
};
const rawSJPData = fs.readFileSync(path.resolve(__dirname, '../../mocks/trimmedSJPCases.json'), 'utf-8');
const sjpCases = JSON.parse(rawSJPData).results;

describe('Get publications', () => {
    it('should correctly render if location is passed and ref data exists', async () => {
        sinon
            .stub(LocationService.prototype, 'getLocationById')
            .withArgs(1)
            .resolves(JSON.parse('{"name":"New Court"}'));

        sinon.stub(PublicationService.prototype, 'getPublicationsByLocation').withArgs(1).resolves(sjpCases);

        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.query = { locationId: '1' };
        request.user = { id: 1 };

        const responseMock = sinon.mock(response);

        const expectedData = {
            ...i18n['blob-view-publications'],
            locationName: 'Missing Court',
            list_of_pubs: [],
            noMatchArtefact: false,
        };
        responseMock.expects('render').once().withArgs('system-admin/blob-view-publications', expectedData);
        responseMock.verify;
    });

    it('should render error page if location ID is not an integer', async () => {
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.query = { locationId: 'Test1' };
        request.user = { id: 1 };

        const responseMock = sinon.mock(response);

        responseMock.expects('render').once().withArgs('error', { ...i18n.error });
        await blobViewController.get(request, response);
        responseMock.verify;
    });

    it('should render No Match artefacts if location ID equals noMatch', async () => {
        sinon.stub(PublicationService.prototype, 'getNoMatchPublications').resolves(sjpCases);

        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;

        const request = mockRequest(i18n);
        request.query = { locationId: 'noMatch' };
        request.user = { userId: 1 };

        const responseMock = sinon.mock(response);
        const expectedData = {
            ...i18n['blob-view-publications'],
            locationName: 'No match artefacts',
            listOfPublications: sjpCases,
            noMatchArtefact: true,
        };
        responseMock.expects('render').once().withArgs('system-admin/blob-view-publications', expectedData);
        await blobViewController.get(request, response);
        responseMock.verify();
    });
});

describe('Get publications (no stubs)', () => {
    it('should render the error screen if artefact ID has not been provided', async () => {
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.user = { id: 1 };
        request.query = {};

        const responseMock = sinon.mock(response);
        responseMock.expects('render').once().withArgs('error');
        await blobViewController.get(request, response);
        responseMock.verify;
    });
});
