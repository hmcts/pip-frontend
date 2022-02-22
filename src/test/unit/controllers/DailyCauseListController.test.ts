import sinon from 'sinon';
import { Response } from 'express';
import DailyCauseListController from '../../../main/controllers/DailyCauseListController';
import fs from 'fs';
import path from 'path';
import { PublicationService } from '../../../main/service/publicationService';
import {mockRequest} from '../mocks/mockRequest';
import moment from 'moment';

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/dailyCauseList.json'), 'utf-8');
const searchResults = JSON.parse(rawData);

const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../mocks/dailyCauseListMetaData.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData);

const dailyCauseListController = new DailyCauseListController();

const dailyCauseListJsonStub = sinon.stub(PublicationService.prototype, 'getIndivPubJson');
const dailyCauseListMetaDataStub = sinon.stub(PublicationService.prototype, 'getIndivPubMetadata');

const artefactId = 'abc';

dailyCauseListJsonStub.withArgs(artefactId).returns(searchResults);
dailyCauseListJsonStub.withArgs('').returns([]);

dailyCauseListMetaDataStub.withArgs(artefactId).returns(metaData);
dailyCauseListMetaDataStub.withArgs('').returns([]);

const i18n = {
  'daily-cause-list': {},
};

describe('Daily Cause List Controller', () => {
  const response = { render: () => {return '';}} as unknown as Response;

  it('should render the daily cause list page', () =>  {

    const request = mockRequest(i18n);

    request.query = {artefactId: artefactId};

    const responseMock = sinon.mock(response);

    const expectedData = {
      ...i18n['daily-cause-list'],
      searchResults,
      contactDate: moment(Date.parse(metaData['contentDate'])).format('DD MMMM YYYY'),
      publishedDate: moment(Date.parse(searchResults['document']['publicationDate'])).format('DD MMMM YYYY'),
      publishedTime: moment(Date.parse(searchResults['document']['publicationDate'])).format('hha'),
    };

    responseMock.expects('render').once().withArgs('daily-cause-list', expectedData);

    return dailyCauseListController.get(request, response).then(() => {
      responseMock.verify();
    });
  });

  it('should render error page is query param is empty', async () => {
    const request = mockRequest(i18n);
    request.query = {};

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);
    await dailyCauseListController.get(request, response);
    return responseMock.verify();
  });

});
