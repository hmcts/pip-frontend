import SummaryOfPublicationsController from '../../../main/controllers/SummaryOfPublicationsController';
import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import sinon from 'sinon';
import fs from 'fs';
import path from 'path';
import { LocationService } from '../../../main/service/LocationService';
import { SummaryOfPublicationsService } from '../../../main/service/SummaryOfPublicationsService';

const publicationController = new SummaryOfPublicationsController();
const i18n = {
    'list-option': {},
};
const court = { name: 'New Court', email: 'test@test.com', contactNo: '0123456789' };

const rawSJPData = fs.readFileSync(path.resolve(__dirname, '../mocks/trimmedSJPCases.json'), 'utf-8');
const sjpCases = JSON.parse(rawSJPData).results;
const additionalLocationInfo = {
    noListMessage: 'English no list message',
    welshNoListMessage: 'Welsh no list message',
};

sinon
    .stub(LocationService.prototype, 'getLocationById')
    .resolves(JSON.parse('{"name":"New Court", "email": "test@test.com", "contactNo": "0123456789"}'));
sinon.stub(SummaryOfPublicationsService.prototype, 'getPublications').resolves(sjpCases);

const additionalLocationInfoStub = sinon.stub(LocationService.prototype, 'getAdditionalLocationInfo');
additionalLocationInfoStub.withArgs('1').returns(null);
additionalLocationInfoStub.withArgs('2').returns(additionalLocationInfo);

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
            publications: sjpCases,
            court,
            noListMessageOverride: '',
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
            publications: sjpCases,
            court,
            noListMessageOverride: 'English no list message',
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
            publications: sjpCases,
            court,
            noListMessageOverride: 'Welsh no list message',
        };

        responseMock.expects('render').once().withArgs('summary-of-publications', expectedData);

        await publicationController.get(request, response);
        responseMock.verify();
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
        responseMock.expects('render').once().withArgs('error');
    });
});
