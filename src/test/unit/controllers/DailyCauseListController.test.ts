import sinon from 'sinon';
import { Response } from 'express';
import DailyCauseListController from '../../../main/controllers/DailyCauseListController';
import fs from 'fs';
import path from 'path';
import { SummaryOfPublicationsService } from '../../../main/service/summaryOfPublicationsService';
import {mockRequest} from '../mocks/mockRequest';
import moment from 'moment';

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/dailyCauseList.json'), 'utf-8');
const searchResults = JSON.parse(rawData);

const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../mocks/dailyCauseListMetaData.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData);

const dailyCauseListController = new DailyCauseListController();

sinon.stub(SummaryOfPublicationsService.prototype, 'getIndivPubJson').resolves(searchResults);
sinon.stub(SummaryOfPublicationsService.prototype, 'getIndivPubMetadata').resolves(metaData);

const i18n = {
  'daily-cause-list': {},
};

describe('Daily Cause List Controller', () => {
  it('should render the daily cause list page', () =>  {

    const response = {
      render: function() {return '';},
    } as unknown as Response;
    const request = mockRequest(i18n);

    request.query = {artefactId: 'abc'};

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

});
