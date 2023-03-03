import SummaryOfPublicationsController from '../../../main/controllers/SummaryOfPublicationsController';
import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import sinon from 'sinon';
import fs from 'fs';
import path from 'path';
import { LocationService } from '../../../main/service/locationService';
import { SummaryOfPublicationsService } from '../../../main/service/summaryOfPublicationsService';

const publicationController = new SummaryOfPublicationsController();
const i18n = {
    'list-option': {},
};
const court = { name: 'New Court', email: 'test@test.com', contactNo: '0123456789' };
const sjpCourt = { name: 'Single Justice Procedure' };

const rawSJPData = fs.readFileSync(path.resolve(__dirname, '../mocks/trimmedSJPCases.json'), 'utf-8');
const sjpCases = JSON.parse(rawSJPData).results;
const CourtStub = sinon.stub(LocationService.prototype, 'getLocationById');
const SoPStub = sinon.stub(SummaryOfPublicationsService.prototype, 'getPublications');

describe('Get publications', () => {
    CourtStub.withArgs(9).resolves(JSON.parse('{"name":"Single Justice Procedure"}'));
    CourtStub.withArgs(1).resolves(
        JSON.parse('{"name":"New Court", "email": "test@test.com", "contactNo": "0123456789"}')
    );
    SoPStub.withArgs(9).resolves(sjpCases);
    SoPStub.withArgs(1).resolves(sjpCases);

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
            isSjp: false,
        };

        responseMock.expects('render').once().withArgs('summary-of-publications', expectedData);

        await publicationController.get(request, response);
        responseMock.verify();
    });

    it('should render the SJP if locationId = 9', async () => {
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;

        const request = mockRequest(i18n);
        request.query = { locationId: '9' };
        request.user = {};

        const responseMock = sinon.mock(response);

        const expectedData = {
            ...i18n['summary-of-publications'],
            locationName: 'Single Justice Procedure',
            publications: sjpCases,
            court: sjpCourt,
            isSjp: true,
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
