import sinon from 'sinon';
import {Response} from 'express';
import {PublicationService} from '../../../main/service/publicationService';
import SjpPublicListController from '../../../main/controllers/SjpPublicListController';
import moment from 'moment';
import fs from 'fs';
import path from 'path';
import {mockRequest} from '../mocks/mockRequest';

const responseRender = {render: () => {return '';}} as unknown as Response;
const mockSJPPublic = fs.readFileSync(path.resolve(__dirname, '../mocks/SJPMockPage.json'), 'utf-8');
const JsonifiedData = JSON.parse(mockSJPPublic);
let i18n = {};
const jsonStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson');

describe('List Type Controller', () => {
  const listTypeController = new SjpPublicListController();

  it('should return the SJP list when it is an SJP List', () => {
    jsonStub.withArgs('1', true).resolves(JsonifiedData);
    i18n = {
      'single-justice-procedure': {},
    };
    const request = mockRequest(i18n);
    request.query = {'artefactId':'1'};
    const data = JsonifiedData.courtLists[0].courtHouse.courtRoom[0].session[0].sittings;
    const expectedData = {
      casesList: JSON.parse(mockSJPPublic).courtLists[0].courtHouse.courtRoom[0].session[0].sittings,
      length: data.length,
      date: moment().format('dddd, MMMM Do YYYY [at] h:mm a'),
      ...i18n['single-justice-procedure'],
    };
    const responseMock = sinon.mock(responseRender);
    responseMock.expects('render').once().withArgs('single-justice-procedure', expectedData);
    return listTypeController.get(request, responseRender).then(() => {
      responseMock.verify();
    });
  });
});
