import sinon from 'sinon';
import fs from 'fs';
import path from 'path';
import { PublicationService } from '../../../main/service/publicationService';
import { LocationService } from '../../../main/service/locationService';
import { DataManipulationService } from '../../../main/service/dataManipulationService';
import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import EtFortnightlyListController from '../../../main/controllers/EtFortnightlyListController';

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/etDailyList.json'), 'utf-8');
const rawTableData = fs.readFileSync(path.resolve(__dirname, '../mocks/etFortnightlyList.json'), 'utf-8');
const listData = JSON.parse(rawData);
const tableData = JSON.parse(rawTableData);

const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];

const rawDataCourt = fs.readFileSync(path.resolve(__dirname, '../mocks/courtAndHearings.json'), 'utf-8');
const courtData = JSON.parse(rawDataCourt);

const etDailyListController = new EtFortnightlyListController();

const etDailyListJsonStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson');
const etDailyListMetaDataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
sinon.stub(LocationService.prototype, 'getLocationById').resolves(courtData[0]);
sinon.stub(DataManipulationService.prototype, 'reshapeEtDailyListData').returns(listData);
sinon.stub(DataManipulationService.prototype, 'dataSplitterEtList').returns(tableData);

const artefactId = 'abc';

etDailyListJsonStub.withArgs(artefactId).resolves(listData);
etDailyListJsonStub.withArgs('').resolves([]);

etDailyListMetaDataStub.withArgs(artefactId).resolves(metaData);
etDailyListMetaDataStub.withArgs('').resolves([]);

const i18n = {
  'et-daily-cause-list': {},
};

describe('Et Fortnightly List Controller', () => {
  const response = {
    render: () => {
      return '';
    },
  } as unknown as Response;
  const request = mockRequest(i18n);
  request.path = '/et-fortnightly-list';

  afterEach(() => {
    sinon.restore();
  });

  it('should render the et fortnightly cause list page', async () => {
    request.query = { artefactId: artefactId };
    request.user = { piUserId: '1' };

    const responseMock = sinon.mock(response);
    const expectedData = {
      ...i18n['et-fortnightly-list'],
      tableData,
      listData,
      region: 'Bedford',
      contentDate: '14 February 2022',
      publishedDate: '13 February 2022',
      publishedTime: '9:30am',
      courtName: "Abergavenny Magistrates' Court",
      provenance: 'prov1',
      bill: false,
    };

    responseMock.expects('render').once().withArgs('et-fortnightly-list', expectedData);

    await etDailyListController.get(request, response);
    return responseMock.verify();
  });

  it('should render error page if query param is empty', async () => {
    const request = mockRequest(i18n);
    request.query = {};
    request.user = { piUserId: '123' };

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

    await etDailyListController.get(request, response);
    return responseMock.verify();
  });
});
