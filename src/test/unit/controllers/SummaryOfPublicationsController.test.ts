import SummaryOfPublicationsController from '../../../main/controllers/SummaryOfPublicationsController';
import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import sinon from 'sinon';
import fs from 'fs';
import path from 'path';
import { LocationService } from '../../../main/service/LocationService';
import { PublicationService } from '../../../main/service/PublicationService';

const publicationController = new SummaryOfPublicationsController();
const i18n = {
    'list-option': {},
    error: { title: 'error' },
};
const court = { name: 'New Court', email: 'test@test.com', contactNo: '0123456789' };

const rawMetadata = fs.readFileSync(path.resolve(__dirname, '../mocks/returnedArtefacts.json'), 'utf-8');
const metadata = JSON.parse(rawMetadata);
const additionalLocationInfo = {
    locationMetadataId: '123-456',
    locationId: '1',
    cautionMessage: 'English caution message',
    welshCautionMessage: 'Welsh caution message',
    noListMessage: 'English no list message',
    welshNoListMessage: 'Welsh no list message',
};

sinon
    .stub(LocationService.prototype, 'getLocationById')
    .resolves(JSON.parse('{"name":"New Court", "email": "test@test.com", "contactNo": "0123456789"}'));
sinon.stub(PublicationService.prototype, 'getPublicationsByLocation').resolves(metadata);
sinon.stub(LocationService.prototype, 'getCopVenueId').resolves(999);
sinon.stub(PublicationService.prototype, 'getPublicationsByListType').resolves(metadata);
sinon.stub(LocationService.prototype, 'fetchAllLocations').resolves([
    { locationId: 123, name: 'Court A' },
    { locationId: 2, name: 'Court B' },
]);

const additionalLocationInfoStub = sinon.stub(LocationService.prototype, 'getLocationMetadata');
additionalLocationInfoStub.withArgs(1).returns(null);
additionalLocationInfoStub.withArgs(2).returns(additionalLocationInfo);

const publicationsWithName = [
    {
        ...metadata[0],
        listName: 'Crown Warned List',
        displayName: undefined,
    },
    {
        ...metadata[1],
        listName: 'Single Justice Procedure Public List (Full List)',
        displayName: undefined,
    },
];

describe('Get publications', () => {
    it('should render the Summary of Publications page', async () => {
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;

        const request = mockRequest(i18n);
        request.query = { locationId: '1' };
        request.user = {};

        const responseMock = sinon.mock(response);

        const expectedData = {
            ...i18n['summary-of-publications'],
            locationName: 'New Court',
            publications: publicationsWithName,
            court,
            noListMessageOverride: '',
            cautionMessageOverride: '',
        };

        responseMock.expects('render').once().withArgs('summary-of-publications', expectedData);

        await publicationController.get(request, response);
        responseMock.verify();
    });

    it('should render the Summary of Publications page with no list message override in English', async () => {
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;

        const request = mockRequest(i18n);
        request.lng = 'en';
        request.query = { locationId: '2' };
        request.user = {};

        const responseMock = sinon.mock(response);

        const expectedData = {
            ...i18n['summary-of-publications'],
            locationName: 'New Court',
            publications: publicationsWithName,
            court,
            noListMessageOverride: 'English no list message',
            cautionMessageOverride: 'English caution message',
        };

        responseMock.expects('render').once().withArgs('summary-of-publications', expectedData);

        await publicationController.get(request, response);
        responseMock.verify();
    });

    it('should render the Summary of Publications page with no list message override in Welsh', async () => {
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;

        const request = mockRequest(i18n);
        request.lng = 'cy';
        request.query = { locationId: '2' };
        request.user = {};

        const responseMock = sinon.mock(response);

        const expectedData = {
            ...i18n['summary-of-publications'],
            locationName: 'New Court',
            publications: publicationsWithName,
            court,
            noListMessageOverride: 'Welsh no list message',
            cautionMessageOverride: 'Welsh caution message',
        };

        responseMock.expects('render').once().withArgs('summary-of-publications', expectedData);

        await publicationController.get(request, response);
        responseMock.verify();
    });

    it('should render the Summary of Publications page for COP venue', async () => {
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;

        const request = mockRequest(i18n);
        request.query = { locationId: '999' };
        request.user = {};

        const responseMock = sinon.mock(response);

        const expectedPublications = [
            {
                ...metadata[0],
                listName: 'Court A - Crown Warned List',
                displayName: 'Court A - Crown Warned List',
            },
            {
                ...metadata[1],
                listName: 'Court A - Single Justice Procedure Public List (Full List)',
                displayName: 'Court A - Single Justice Procedure Public List (Full List)',
            },
        ];

        const expectedData = {
            ...i18n['summary-of-publications'],
            locationName: 'New Court',
            publications: expectedPublications,
            court,
            noListMessageOverride: '',
            cautionMessageOverride: '',
        };

        responseMock.expects('render').once().withArgs('summary-of-publications', expectedData);

        await publicationController.get(request, response);
        responseMock.verify();
    });

    it('should render the error page if location ID is no a number', async () => {
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.query = { locationId: 'Test2' };
        request.user = { userId: 1 };
        const responseMock = sinon.mock(response);
        responseMock
            .expects('render')
            .once()
            .withArgs('error', { ...i18n.error });
    });

    it('should render the error screen if there is no locationId passed as a param', async () => {
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.user = { userId: 1 };
        const responseMock = sinon.mock(response);
        responseMock
            .expects('render')
            .once()
            .withArgs('error', { ...i18n.error });
    });
});
