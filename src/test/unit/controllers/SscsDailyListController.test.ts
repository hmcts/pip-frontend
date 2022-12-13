import sinon from 'sinon';
import fs from 'fs';
import path from 'path';
import SscsDailyListController from '../../../main/controllers/SscsDailyListController';
import {PublicationService} from '../../../main/service/publicationService';
import {LocationService} from '../../../main/service/locationService';
import {Response} from 'express';
import {mockRequest} from '../mocks/mockRequest';
import {DateTime} from 'luxon';
import { SscsDailyListService } from '../../../main/service/listManipulation/SscsDailyListService';

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/sscsDailyList.json'), 'utf-8');
const listData = JSON.parse(rawData);

const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];

const rawDataCourt = fs.readFileSync(path.resolve(__dirname, '../mocks/courtAndHearings.json'), 'utf-8');
const courtData = JSON.parse(rawDataCourt);

const sscsDailyListController = new SscsDailyListController();

const sscsDailyListJsonStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson');
const sscsDailyListMetaDataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
sinon.stub(LocationService.prototype, 'getLocationById').resolves(courtData[0]);
sinon.stub(SscsDailyListService.prototype, 'manipulateSscsDailyListData').returns(listData);

const artefactId = 'abc';

sscsDailyListJsonStub.withArgs(artefactId).resolves(listData);
sscsDailyListJsonStub.withArgs('').resolves([]);

sscsDailyListMetaDataStub.withArgs(artefactId).resolves(metaData);
sscsDailyListMetaDataStub.withArgs('').resolves([]);

const i18n = {
  'sscs-daily-list': {},
};

describe('Sscs Daily List Controller', () => {

  const response = { render: () => {return '';}} as unknown as Response;
  const request = mockRequest(i18n);
  request.path = '/sscs-daily-list';

  afterEach(() => {
    sinon.restore();
  });

  it('should render the sscs daily list page', async () => {
    request.query = {artefactId: artefactId};
    request.user = {userId: '1'};

    const responseMock = sinon.mock(response);
    const expectedData = {
      ...i18n['sscs-daily-list'],
      listData,
      contentDate: DateTime.fromISO(metaData['contentDate'], {zone: 'utc'}).toFormat('dd MMMM yyyy'),
      publishedDate: '14 September 2020',
      courtName: 'Abergavenny Magistrates\' Court',
      publishedTime: '12:30am',
      provenance: 'prov1',
      bill: false,
    };

    responseMock.expects('render').once().withArgs('sscs-daily-list', expectedData);

    await sscsDailyListController.get(request, response);
    return responseMock.verify();
  });

  it('should render error page if query param is empty', async () => {
    const request = mockRequest(i18n);
    request.query = {};
    request.user = {userId: '123'};

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

    await sscsDailyListController.get(request, response);
    return responseMock.verify();
  });
});
