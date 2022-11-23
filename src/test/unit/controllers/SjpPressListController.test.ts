import sinon from 'sinon';
import { Response } from 'express';
import SjpPressListController from '../../../main/controllers/SjpPressListController';
import fs from 'fs';
import path from 'path';
import { PublicationService } from '../../../main/service/publicationService';
import {mockRequest} from '../mocks/mockRequest';
import moment from 'moment';

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/SJPMockPage.json'), 'utf-8');
const sjpData = JSON.parse(rawData);

const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];

const sjpPressListController = new SjpPressListController();

const sjpPressListJsonStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson');
const sjpPressListMetaDataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');

const artefactId = 'abc';

sjpPressListJsonStub.withArgs(artefactId).resolves(sjpData);
sjpPressListJsonStub.withArgs('').resolves([]);

sjpPressListMetaDataStub.withArgs(artefactId).resolves(metaData);
sjpPressListMetaDataStub.withArgs('').resolves([]);

const i18n = {
  'single-justice-procedure-press': {},
};

describe('SJP Press List Controller', () => {
  const response = { render: () => {return '';}} as unknown as Response;

  it('should render the SJP press list page', async () =>  {
    const request = mockRequest(i18n);
    request.user = {piUserId: '1'};

    request.query = {artefactId: artefactId};

    const responseMock = sinon.mock(response);

    const expectedData = {
      ...i18n['single-justice-procedure-press'],
      sjpData: sjpData,
      publishedDateTime: '14 September 2016',
      publishedTime: '12:30am',
      contactDate: moment(Date.parse(metaData['contentDate'])).format('D MMMM YYYY'),
      artefactId: 'abc',
      user: request.user,
    };

    responseMock.expects('render').once().withArgs('single-justice-procedure-press', expectedData);

    await sjpPressListController.get(request, response);
    return responseMock.verify();

  });

  it('should render error page is query param is empty', async () => {
    const request = mockRequest(i18n);
    request.query = {};
    request.user = {piUserId: '1'};

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

    await sjpPressListController.get(request, response);
    return responseMock.verify();
  });

  it('should render error page if list is not allowed to view by the user', async () => {
    const request = mockRequest(i18n);
    request.query = {};

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

    await sjpPressListController.get(request, response);
    return responseMock.verify();
  });

});
