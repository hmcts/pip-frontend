import sinon from 'sinon';
import { Response } from 'express';
import fs from 'fs';
import path from 'path';
import { PublicationService } from '../../../main/service/publicationService';
import {mockRequest} from '../mocks/mockRequest';
import moment from 'moment';
import {LocationService} from '../../../main/service/locationService';
import {DataManipulationService} from '../../../main/service/dataManipulationService';
import CrownDailyListController from '../../../main/controllers/CrownDailyListController';
import {CrownDailyListService} from '../../../main/service/listManipulation/crownDailyListService';

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/crownDailyList.json'), 'utf-8');
const listData = JSON.parse(rawData);

const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];

const rawDataCourt = fs.readFileSync(path.resolve(__dirname, '../mocks/courtAndHearings.json'), 'utf-8');
const courtData = JSON.parse(rawDataCourt);

const crownDailyListController = new CrownDailyListController();

const crownDailyListJsonStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson');
const crownDailyListMetaDataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
sinon.stub(LocationService.prototype, 'getLocationById').resolves(courtData[0]);
sinon.stub(DataManipulationService.prototype, 'manipulatedDailyListData').returns(listData);
sinon.stub(CrownDailyListService.prototype, 'manipulatedCrownDailyListData').returns(listData);
sinon.stub(CrownDailyListService.prototype, 'findUnallocatedCasesInCrownDailyListData').returns(listData);

const artefactId = 'abc';

crownDailyListJsonStub.withArgs(artefactId).resolves(listData);
crownDailyListJsonStub.withArgs('').resolves([]);

crownDailyListMetaDataStub.withArgs(artefactId).resolves(metaData);
crownDailyListMetaDataStub.withArgs('').resolves([]);

const i18n = {
  'crown-daily-list': {},
};

describe('Crown Daily List Controller', () => {

  const response = { render: () => {return '';}} as unknown as Response;
  const request = mockRequest(i18n);
  request.path = '/crown-daily-list';

  afterEach(() => {
    sinon.restore();
  });

  it('should render the crown daily list page', async () =>  {
    request.query = {artefactId: artefactId};
    request.user = {piUserId: '1'};

    const responseMock = sinon.mock(response);

    const expectedData = {
      ...i18n['crown-daily-list'],
      listData,
      contentDate: moment(Date.parse(metaData['contentDate'])).format('DD MMMM YYYY'),
      publishedDate: '14 September 2020',
      courtName: 'Abergavenny Magistrates\' Court',
      publishedTime: '12:30am',
      provenance: 'prov1',
      version:'',
      bill: false,
    };

    responseMock.expects('render').once().withArgs('crown-daily-list', expectedData);

    await crownDailyListController.get(request, response);
    return responseMock.verify();
  });

  it('should render error page is query param is empty', async () => {

    request.query = {};
    request.user = {piUserId: '1'};
    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

    await crownDailyListController.get(request, response);
    return responseMock.verify();
  });

  it('should render error page if list is not allowed to view by the user', async () => {

    request.query = {artefactId: artefactId};
    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

    await crownDailyListController.get(request, response);
    return responseMock.verify();
  });

});
