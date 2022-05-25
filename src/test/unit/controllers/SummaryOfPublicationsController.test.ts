import SummaryOfPublicationsController from '../../../main/controllers/SummaryOfPublicationsController';
import {Response} from 'express';
import {mockRequest} from '../mocks/mockRequest';
import sinon from 'sinon';
import fs from 'fs';
import path from 'path';
import {LocationService} from '../../../main/service/locationService';
import {SummaryOfPublicationsService} from '../../../main/service/summaryOfPublicationsService';

const publicationController = new SummaryOfPublicationsController();
const i18n = {
  'list-option': {},
};
const rawSJPData = fs.readFileSync(path.resolve(__dirname, '../mocks/trimmedSJPCases.json'), 'utf-8');
const sjpCases = JSON.parse(rawSJPData).results;
const onePubData = fs.readFileSync(path.resolve(__dirname, '../mocks/onePublication.json'), 'utf-8');
const onePub = JSON.parse(onePubData);
const CourtStub = sinon.stub(LocationService.prototype, 'getCourtById');
const SoPStub = sinon.stub(SummaryOfPublicationsService.prototype, 'getPublications');

describe('Get publications', () => {
  CourtStub.withArgs(0).resolves(JSON.parse('{"name":"Single Justice Procedure"}'));
  CourtStub.withArgs(1).resolves(JSON.parse('{"name":"New Court"}'));
  SoPStub.withArgs(0).resolves(sjpCases);
  SoPStub.withArgs(1).resolves(sjpCases);

  it('should render the Summary of Publications page', async () => {

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
      ...i18n['summary-of-publications'],
      locationName: 'New Court',
      publications: sjpCases,
    };

    responseMock.expects('render').once().withArgs('summary-of-publications', expectedData);

    await publicationController.get(request, response);
    responseMock.verify();
  });

  it('should render the SJP if locationId = 0', async () => {

    const response = {
      render: () => {
        return '';
      },
    } as unknown as Response;

    const request = mockRequest(i18n);
    request.query = {locationId: '0'};
    request.user = {id: 1};

    const responseMock = sinon.mock(response);

    const expectedData = {
      ...i18n['summary-of-publications'],
      courtName: 'Single Justice Procedure',
      publications: sjpCases,
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
    request.user = {id: 1};
    const responseMock = sinon.mock(response);
    responseMock.expects('render').once().withArgs('error');
  });
});

describe('Get individual publication and act appropriately', () => {

  it('should open the file directly if only one pub is returned from publicationService', async () => {
    const response = {
      redirect: function () {
        return '';
      },
    } as unknown as Response;
    const request = mockRequest(i18n);
    request.query = {locationId: '0'};
    request.user = {id: 1};
    SoPStub.withArgs(0).resolves(onePub);
    CourtStub.withArgs('0').resolves(JSON.parse('{"name":"Single Justice Procedure"}'));
    const responseMock = sinon.mock(response);
    responseMock.expects('redirect').once().withArgs(`file-publication?artefactId=${onePub[0].artefactId}`);

    await publicationController.get(request, response);
    responseMock.verify();
  });

  it('should open the json directly if only one pub is returned from publicationService', async () => {
    const response = {
      redirect: function () {
        return '';
      },
    } as unknown as Response;
    const request = mockRequest(i18n);
    request.query = {locationId: '2'};
    request.user = {id: 1};
    onePub[0]['isFlatFile'] = false;
    SoPStub.withArgs(2).resolves(onePub);
    CourtStub.withArgs('0').resolves(JSON.parse('{"name":"Single Justice Procedure"}'));
    const responseMock = sinon.mock(response);
    const onePubJsonLength = onePub.length;
    expect(onePubJsonLength).toBe(1);
    responseMock.expects('redirect').once().withArgs(`sjp-public-list?artefactId=${onePub[0].artefactId}`);

    await publicationController.get(request, response);
    responseMock.verify();
  });
});
