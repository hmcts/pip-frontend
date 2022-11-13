import {Response} from 'express';
import {mockRequest} from '../mocks/mockRequest';
import sinon from 'sinon';
import {LocationService} from '../../../main/service/locationService';
import BlobViewPublicationsController from '../../../main/controllers/BlobViewPublicationsController';
import {SummaryOfPublicationsService} from '../../../main/service/summaryOfPublicationsService';
import fs from 'fs';
import path from 'path';

const blobViewController = new BlobViewPublicationsController();
const i18n = {
  'blob-view-publications': {},
};
const rawSJPData = fs.readFileSync(path.resolve(__dirname, '../mocks/trimmedSJPCases.json'), 'utf-8');
const sjpCases = JSON.parse(rawSJPData).results;
const CourtStub = sinon.stub(LocationService.prototype, 'getLocationById');
const SoPStub = sinon.stub(SummaryOfPublicationsService.prototype, 'getPublications');

describe('Get publications', () => {

  it('should correctly render if location is passed and ref data exists',
    async () => {

      CourtStub.withArgs(0).resolves(JSON.parse('{"name":"Single Justice Procedure"}'));
      CourtStub.withArgs(1).resolves(JSON.parse('{"name":"New Court"}'));
      SoPStub.withArgs(0).resolves(sjpCases);
      SoPStub.withArgs(1).resolves(sjpCases);

      const response = {
        render: () => {
          return '';
        },
      } as unknown as Response;
      const request = mockRequest(i18n);
      request.query = {locationId: '1'};
      request.user = {id: 1};

      const responseMock = sinon.mock(response);

      const expectedData = {
        ...i18n['blob-view-publications'],
        locationName: 'Missing Court',
        list_of_pubs: [],
      };
      responseMock.expects('render').once().withArgs('blob-view-publications', expectedData);
      responseMock.verify;
    });
});

describe('Get publications (no stubs)', () => {
  it('should render the missing court page if location is passed in the query but reference data is not found',
    async () => {
      const response = {
        render: () => {
          return '';
        },
      } as unknown as Response;

      const request = mockRequest(i18n);
      request.query = {locationId: '1'};
      request.user = {id: 1};

      const responseMock = sinon.mock(response);
      const expectedData = {
        ...i18n['blob-view-publications'],
        locationName: 'New Court',
        list_of_pubs: sjpCases,
      };
      responseMock.expects('render').once().withArgs('blob-view-publications', expectedData);
      await blobViewController.get(request, response);
      responseMock.verify();
    });

  it('should render the error screen if the various endpoints fail and nothing is returned to the controller', async () => {
    const response = {
      render: () => {
        return '';
      },
    } as unknown as Response;
    const request = mockRequest(i18n);
    request.user = {id: 1};
    const responseMock = sinon.mock(response);
    responseMock.expects('render').once().withArgs('error');
    responseMock.verify;
  });

});
