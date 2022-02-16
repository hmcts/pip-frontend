import sinon from 'sinon';
import {Response} from 'express';
import {SummaryOfPublicationsService} from '../../../main/service/summaryOfPublicationsService';
import ListTypeController from '../../../main/controllers/ListTypeController';
import {PipRequest} from '../../../main/models/request/PipRequest';
import moment from 'moment';
import fs from 'fs';
import path from 'path';

const jsonStub = sinon.stub(SummaryOfPublicationsService.prototype, 'getIndivPubJson');
const metaStub = sinon.stub(SummaryOfPublicationsService.prototype, 'getIndivPubMetadata');
const mockJson = '{"listType": "false"}';
const responseSend = {send: () => {return '';}, set: () => {return '';}} as unknown as Response;
const responseRender = {render: () => {return '';}} as unknown as Response;
const mockSJPPublic = fs.readFileSync(path.resolve(__dirname, '../mocks/SJPMockPage.json'), 'utf-8');
const meta = JSON.parse('{"artefactId": "664959fd-80ba-4dcc-ab92-38c5056327b6","provenance": "HellSJP","sourceArtefactId": "Ball4.json","type": "LIST","sensitivity": "PUBLIC","language": "ENGLISH","search": {},"displayFrom": "2022-01-28T18:29:18.298","displayTo": "2022-03-28T18:29:18.297","listType": "SJP_PUBLIC_LIST","courtId": "0","contentDate": "2022-02-15T18:29:18.29","isFlatFile": false,"payload": "https://pipsssastg.blob.core.windows.net/artefact/Ball4.json-HellSJP"}');
let i18n = {};
describe('List Type Controller', () => {
  const listTypeController = new ListTypeController();

  it('should return a json file when not an SJP List', () => {
    jsonStub.withArgs(0).resolves(mockJson);
    metaStub.withArgs(0).resolves('{"listType":"notSJPList"}');
    const request = {
      query: {'artefactId': 0}, i18n: {
        getDataByLanguage: '',
      },
    } as unknown as PipRequest;
    request.i18n.getDataByLanguage = jest.fn().mockReturnValue('mockI18n');
    const responseMock = sinon.mock(responseSend);
    responseMock.expects('send').once().withArgs(mockJson);
    return listTypeController.get(request, responseSend).then(() => {
      responseMock.verify();
    });
  });

  it('should return the SJP list when it is an SJP List', () => {
    jsonStub.withArgs(1).resolves(JSON.parse(mockSJPPublic));
    metaStub.withArgs(1).resolves(meta);
    i18n = {
      'single-justice-procedure': {},
    };
    const request = {
      query: {'artefactId': 1}, i18n: {
        getDataByLanguage: '',
      },
    } as unknown as PipRequest;
    request.i18n.getDataByLanguage = jest.fn().mockReturnValue('mockI18n');
    const JsonifiedData = JSON.parse(mockSJPPublic);
    const data = JsonifiedData.courtLists[0].courtHouse.courtRoom[0].session[0].sittings;
    const length = data.length;
    const expectedData = {
      casesList: JSON.parse(mockSJPPublic).courtLists[0].courtHouse.courtRoom[0].session[0].sittings,
      length: length,
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
