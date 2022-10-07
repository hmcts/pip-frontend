import sinon from 'sinon';
import {Response} from 'express';
import {PublicationService} from '../../../main/service/publicationService';
import fs from 'fs';
import path from 'path';
import {mockRequest} from '../mocks/mockRequest';
import SjpPublicListController from '../../../main/controllers/SjpPublicListController';

const sjpPublicListController = new SjpPublicListController();

const artefactId = '1';

const mockSJPPublic = fs.readFileSync(path.resolve(__dirname, '../mocks/SJPMockPage.json'), 'utf-8');
const data = JSON.parse(mockSJPPublic);

const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];

const i18n = {};
const jsonStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson');
jsonStub.withArgs(artefactId, '123').resolves(data);

const sjpPublicListMetaDataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');

sjpPublicListMetaDataStub.withArgs(artefactId).resolves(metaData);
sjpPublicListMetaDataStub.withArgs('').resolves([]);

describe('SJP Public List Type Controller', () => {
  const response = { render: () => {return '';}} as unknown as Response;

  it('should render the SJP public list page', async () =>  {
    const request = mockRequest(i18n);
    request.user = {piUserId: '123'};

    request.query = {artefactId: artefactId};

    const responseMock = sinon.mock(response);

    const expectedData = {
      sjpData: data,
      length: 2,
      publishedDateTime: '14 September 2016',
      publishedTime: '12:30am',
      ...i18n['single-justice-procedure'],
    };

    responseMock.expects('render').once().withArgs('single-justice-procedure', expectedData);

    await sjpPublicListController.get(request, response);
    return responseMock.verify();
  });

  it('should render error page is query param is empty', async () => {
    const request = mockRequest(i18n);
    request.query = {};
    request.user = {piUserId: '123'};

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

    await sjpPublicListController.get(request, response);
    return responseMock.verify();
  });

  it('should render error page if list is not allowed to view by the user', async () => {
    const request = mockRequest(i18n);
    request.query = {};

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

    await sjpPublicListController.get(request, response);
    return responseMock.verify();
  });
});
