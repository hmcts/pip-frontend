import SummaryOfPublicationsController from '../../../main/controllers/SummaryOfPublicationsController';
import {Response} from 'express';
import {mockRequest} from '../mocks/mockRequest';
import sinon from 'sinon';
import {PublicationService} from '../../../main/service/publicationService';
import fs from 'fs';
import path from 'path';
import {CourtService} from '../../../main/service/courtService';

const publicationController = new SummaryOfPublicationsController();
const i18n = {
  'list-option': {},
};
const rawSJPData = fs.readFileSync(path.resolve(__dirname, '../mocks/trimmedSJPCases.json'), 'utf-8');
const sjpCases = JSON.parse(rawSJPData).results;
const onePubData = fs.readFileSync(path.resolve(__dirname, '../mocks/onePublication.json'), 'utf-8');
const onePub = JSON.parse(onePubData);
const CourtStub = sinon.stub(CourtService.prototype, 'getCourtById');
const SoPStub = sinon.stub(PublicationService.prototype, 'getPublications');

describe('Get publications', () => {
  CourtStub.withArgs(0).resolves(JSON.parse('{"name":"Single Justice Procedure (SJP)"}'));
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
    request.query = {courtId: '1'};
    request.user = {id: 1};

    const responseMock = sinon.mock(response);

    const expectedData = {
      ...i18n['summary-of-publications'],
      courtName: 'New Court',
      publications: sjpCases,
    };

    responseMock.expects('render').once().withArgs('summary-of-publications', expectedData);

    await publicationController.get(request, response);
    responseMock.verify();
  });

  it('should render the SJP if courtId = 0', async () => {

    const response = {
      render: () => {
        return '';
      },
    } as unknown as Response;

    const request = mockRequest(i18n);
    request.query = {courtId: '0'};
    request.user = {id: 1};

    const responseMock = sinon.mock(response);

    const expectedData = {
      ...i18n['summary-of-publications'],
      courtName: 'Single Justice Procedure (SJP)',
      publications: sjpCases,
    };

    responseMock.expects('render').once().withArgs('summary-of-publications', expectedData);

    await publicationController.get(request, response);
    responseMock.verify();
  });

  it('should render the error screen if there is no courtId passed as a param', async () => {
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

  it('should open the pub directly if only one pub is returned from publicationService', async () => {
    const response = {
      send: function () {
        return '';
      },
    } as unknown as Response;
    const request = mockRequest(i18n);
    request.query = {courtId: '0'};
    request.user = {id: 1};
    SoPStub.withArgs(0).resolves(onePub);
    CourtStub.withArgs('0').resolves(JSON.parse('{"name":"Single Justice Procedure (SJP)"}'));
    const responseMock = sinon.mock(response);
    const onePubLength = onePub.length;
    expect(onePubLength).toBe(1);
    responseMock.expects('send').once().withArgs('Hi there, there\'s only one publication so you\'ve been directed here');

    await publicationController.get(request, response);
    responseMock.verify();
  });
});
