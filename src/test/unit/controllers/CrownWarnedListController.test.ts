import sinon from 'sinon';
import { Response } from 'express';
import fs from 'fs';
import path from 'path';
import { PublicationService } from '../../../main/service/publicationService';
import {mockRequest} from '../mocks/mockRequest';
import moment from 'moment';
import {CrownWarnedListService} from '../../../main/service/listManipulation/crownWarnedListService';
import CrownWarnedListController from '../../../main/controllers/CrownWarnedListController';

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/crownWarnedList.json'), 'utf-8');
const rawDataObj = JSON.parse(rawData);

const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];

const crownWarnedListController = new CrownWarnedListController();

const crownWarnedListJsonStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson');
const crownWarnedListMetaDataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');

const artefactId = 'abc';
const allocatedData = {
  caseReference: '1',
  defendant: '2',
  hearingDate: '3',
  defendantRepresentative: '4',
  prosecutingAuthority: '5',
  linkedCases: '6',
  listingNotes: '7',
};

const toBeAllocatedData = {
  caseReference: '9',
  defendant: '9',
  hearingDate: '9',
  defendantRepresentative: '9',
  prosecutingAuthority: '9',
  linkedCases: '9',
  listingNotes: '9',
};

const listData = new Map<string, object[]>;
listData.set('Hearing type', [allocatedData]);
listData.set('To be allocated', [toBeAllocatedData]);
sinon.stub(CrownWarnedListService.prototype, 'manipulateData').returns(listData);

const listDataWithAllocatedData = new Map<string, object[]>;
listDataWithAllocatedData.set('Hearing type', [allocatedData]);

crownWarnedListJsonStub.withArgs(artefactId).resolves(rawDataObj);
crownWarnedListJsonStub.withArgs('').resolves([]);

crownWarnedListMetaDataStub.withArgs(artefactId).resolves(metaData);
crownWarnedListMetaDataStub.withArgs('').resolves([]);

const i18n = {
  'crown-warned-list': {},
};

describe('Crown Warned List Controller', () => {
  const response = { render: () => {return '';}} as unknown as Response;
  const request = mockRequest(i18n);
  request.path = '/crown-warned-list';

  afterEach(() => {
    sinon.restore();
  });

  it('should render the crown warned list page', async () =>  {
    request.query = {artefactId: artefactId};
    request.user = {piUserId: '1'};

    const responseMock = sinon.mock(response);

    const expectedData = {
      ...i18n['crown-warned-list'],
      listData: listDataWithAllocatedData,
      toBeAllocatedData: [toBeAllocatedData],
      venue: rawDataObj['venue'],
      contentDate: moment(Date.parse(metaData['contentDate'])).format('DD MMMM YYYY'),
      publishedDate: '13 September 2022',
      publishedTime: '12:30pm',
      version: '1.0',
      provenance: 'prov1',
      bill: false,
    };

    responseMock.expects('render').once().withArgs('crown-warned-list', expectedData);

    await crownWarnedListController.get(request, response);
    return responseMock.verify();
  });

  it('should render error page is query param is empty', async () => {
    request.query = {};
    request.user = {piUserId: '1'};
    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

    await crownWarnedListController.get(request, response);
    return responseMock.verify();
  });
});
