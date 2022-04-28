import sinon from 'sinon';
import { Response } from 'express';
import DailyCauseListController from '../../../main/controllers/DailyCauseListController';
import fs from 'fs';
import path from 'path';
import { PublicationService } from '../../../main/service/publicationService';
import {mockRequest} from '../mocks/mockRequest';
import moment from 'moment';

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/familyDailyCauseList.json'), 'utf-8');
const listData = JSON.parse(rawData);

const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];

const dailyCauseListController = new DailyCauseListController();

const dailyCauseListJsonStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson');
const dailyCauseListMetaDataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
sinon.stub(PublicationService.prototype, 'manipulatedDailyListData').returns(listData);

const artefactId = 'abc';

dailyCauseListJsonStub.withArgs(artefactId).resolves(listData);
dailyCauseListJsonStub.withArgs('').resolves([]);

dailyCauseListMetaDataStub.withArgs(artefactId).resolves(metaData);
dailyCauseListMetaDataStub.withArgs('').resolves([]);

const i18n = {
  'daily-cause-list': {},
};

describe('Daily Cause List Controller', () => {

  const response = { render: () => {return '';}} as unknown as Response;
  const request = mockRequest(i18n);
  request.path = '/daily-cause-list';

  it('should render the daily cause list page', async () =>  {

    request.query = {artefactId: artefactId};

    const responseMock = sinon.mock(response);

    const expectedData = {
      ...i18n['daily-cause-list'],
      listData,
      contactDate: moment(Date.parse(metaData['contentDate'])).format('DD MMMM YYYY'),
      publishedDate: moment(Date.parse(listData['document']['publicationDate'])).format('DD MMMM YYYY'),
      publishedTime: '11.30pm',
      provenance: 'prov1',
    };

    responseMock.expects('render').once().withArgs('daily-cause-list', expectedData);

    await dailyCauseListController.get(request, response);
    return responseMock.verify();
  });

  it('should render error page is query param is empty', async () => {
    request.query = {};

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

    await dailyCauseListController.get(request, response);
    return responseMock.verify();
  });

});
