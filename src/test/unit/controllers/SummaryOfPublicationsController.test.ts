import SummaryOfPublicationsController from '../../../main/controllers/SummaryOfPublicationsController';
import {Response} from 'express';
import {mockRequest} from '../mocks/mockRequest';
import sinon from 'sinon';
import fs from 'fs';
import path from 'path';
import {CourtService} from '../../../main/service/courtService';
import {SummaryOfPublicationsService} from '../../../main/service/summaryOfPublicationsService';

const publicationController = new SummaryOfPublicationsController();
const i18n = {
  'list-option': {},
};
const rawSJPData = fs.readFileSync(path.resolve(__dirname, '../mocks/trimmedSJPCases.json'), 'utf-8');
const sjpCases = JSON.parse(rawSJPData).results;
const CourtStub = sinon.stub(CourtService.prototype, 'getCourtById');
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
      courtName: 'Single Justice Procedure',
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
