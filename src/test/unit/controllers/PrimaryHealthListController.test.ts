import sinon from 'sinon';
import fs from 'fs';
import path from 'path';
import PrimaryHealthListController from '../../../main/controllers/PrimaryHealthListController';
import {PublicationService} from '../../../main/service/publicationService';
import {LocationService} from '../../../main/service/locationService';
import {Response} from 'express';
import {mockRequest} from '../mocks/mockRequest';
import moment from 'moment';
import {PrimaryHealthListService} from '../../../main/service/listManipulation/primaryHealthListService';

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/primaryHealthList.json'), 'utf-8');
const listData = JSON.parse(rawData);

const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];

const rawDataCourt = fs.readFileSync(path.resolve(__dirname, '../mocks/courtAndHearings.json'), 'utf-8');
const courtData = JSON.parse(rawDataCourt);

const primaryHealthListController = new PrimaryHealthListController();

const primaryHealthListJsonStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson');
const primaryHealthListMetaDataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
sinon.stub(LocationService.prototype, 'getLocationById').resolves(courtData[0]);
sinon.stub(PrimaryHealthListService.prototype, 'manipulateData').returns(listData);

const artefactId = 'abc';

primaryHealthListJsonStub.withArgs(artefactId).resolves(listData);
primaryHealthListJsonStub.withArgs('').resolves([]);

primaryHealthListMetaDataStub.withArgs(artefactId).resolves(metaData);
primaryHealthListMetaDataStub.withArgs('').resolves([]);

const i18n = {
  'primary-health-list': {},
};

describe('Primary Health List Controller', () => {

  const response = { render: () => {return '';}} as unknown as Response;
  const request = mockRequest(i18n);
  request.path = '/primary-health-list';

  afterEach(() => {
    sinon.restore();
  });

  it('should render the primary health list list page', async () => {
    request.query = {artefactId: artefactId};
    request.user = {piUserId: '1'};

    const responseMock = sinon.mock(response);
    const expectedData = {
      ...i18n['primary-health-list'],
      contentDate: moment(Date.parse(metaData['contentDate'])).format('DD MMMM YYYY'),
      listData,
      publishedDate: '04 October 2022',
      publishedTime: '10am',
      provenance: 'prov1',
      bill: false,
      venueEmail: 'court1@moj.gov.uk',
    };

    responseMock.expects('render').once().withArgs('primary-health-list', expectedData);

    await primaryHealthListController.get(request, response);
    return responseMock.verify();
  });

  it('should render error page if query param is empty', async () => {
    const request = mockRequest(i18n);
    request.query = {};
    request.user = {piUserId: '123'};
    request.path = '/primary-health-list';

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

    await primaryHealthListController.get(request, response);
    return responseMock.verify();
  });
});
