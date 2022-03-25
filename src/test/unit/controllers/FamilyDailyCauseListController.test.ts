import {mockRequest} from '../mocks/mockRequest';
import moment from 'moment';
import {Response} from 'express';
import sinon from 'sinon';
import fs from 'fs';
import path from 'path';
import FamilyDailyCauseListController from '../../../main/controllers/FamilyDailyCauseListController';
import {PublicationService} from '../../../main/service/publicationService';

const artefactId = 'abc';

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/dailyCauseList.json'), 'utf-8');
const listData = JSON.parse(rawData);

const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];

const familyDailyCauseListController = new FamilyDailyCauseListController();

const dailyCauseListJsonStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson');
const dailyCauseListMetaDataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
sinon.stub(PublicationService.prototype, 'manipulatedDailyListData').returns(listData);

dailyCauseListJsonStub.withArgs(artefactId).resolves(listData);
dailyCauseListJsonStub.withArgs('').resolves([]);

dailyCauseListMetaDataStub.withArgs(artefactId).resolves(metaData);
dailyCauseListMetaDataStub.withArgs('').resolves([]);

describe('Family daily cause list controller', () => {
  const response = { render: () => {return '';}} as unknown as Response;
  const i18n = {
    'family-daily-cause-list': {},
  };
  it ('should render the family daily cause list page', async () => {
    const request = mockRequest(i18n);

    request.query = {artefactId: artefactId};

    const responseMock = sinon.mock(response);

    const expectedData = {
      ...i18n['family-daily-cause-list'],
      listData,
      contactDate: moment(Date.parse(metaData['contentDate'])).format('DD MMMM YYYY'),
      publishedDate: moment(Date.parse(listData['document']['publicationDate'])).format('DD MMMM YYYY'),
      publishedTime: moment(Date.parse(listData['document']['publicationDate'])).format('hha'),
      provenance: metaData['provenance'],
    };

    responseMock.expects('render').once().withArgs('family-daily-cause-list', expectedData);

    await familyDailyCauseListController.get(request, response);
    return responseMock.verify();
  });

  it('should render error page is query param is empty', async () => {
    const request = mockRequest(i18n);
    request.query = {};

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

    await familyDailyCauseListController.get(request, response);
    return responseMock.verify();
  });
});
