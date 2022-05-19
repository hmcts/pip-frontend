import sinon from 'sinon';
import {Response} from 'express';
import {PublicationService} from '../../../main/service/publicationService';
import fs from 'fs';
import path from 'path';
import {mockRequest} from '../mocks/mockRequest';
import {UserService} from '../../../main/service/userService';
import SjpPublicListController from '../../../main/controllers/SjpPublicListController';

const sjpPublicListController = new SjpPublicListController();

const artefactId = '1';

const mockSJPPublic = fs.readFileSync(path.resolve(__dirname, '../mocks/SJPMockPage.json'), 'utf-8');
const JsonifiedData = JSON.parse(mockSJPPublic);
const data = JsonifiedData.courtLists[0].courtHouse.courtRoom[0].session[0].sittings;

const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];

const i18n = {};
const jsonStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson');
jsonStub.withArgs(artefactId, true).resolves(JsonifiedData);

const sjpPublicListMetaDataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');

sjpPublicListMetaDataStub.withArgs(artefactId).resolves(metaData);
sjpPublicListMetaDataStub.withArgs('').resolves([]);

describe('SJP Public List Type Controller', () => {
  const response = { render: () => {return '';}} as unknown as Response;
  afterEach(() => {
    sinon.restore();
  });

  it('should render the SJP public list page', async () =>  {
    sinon.stub(UserService.prototype, 'isAuthorisedToViewListByAzureUserId').resolves(true);
    const request = mockRequest(i18n);

    request.query = {artefactId: artefactId};

    const responseMock = sinon.mock(response);

    const expectedData = {
      casesList: JSON.parse(mockSJPPublic).courtLists[0].courtHouse.courtRoom[0].session[0].sittings,
      length: data.length,
      date: JsonifiedData['document'].publicationDate,
      ...i18n['single-justice-procedure'],
    };

    responseMock.expects('render').once().withArgs('single-justice-procedure', expectedData);

    await sjpPublicListController.get(request, response);
    return responseMock.verify();
  });

  it('should render error page is query param is empty', async () => {
    sinon.stub(UserService.prototype, 'isAuthorisedToViewListByAzureUserId').resolves(true);
    const request = mockRequest(i18n);
    request.query = {};

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

    await sjpPublicListController.get(request, response);
    return responseMock.verify();
  });

  it('should render error page if list is not allowed to view by the user', async () => {
    sinon.stub(UserService.prototype, 'isAuthorisedToViewListByAzureUserId').resolves(false);
    const request = mockRequest(i18n);
    request.query = {};

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

    await sjpPublicListController.get(request, response);
    return responseMock.verify();
  });
});
