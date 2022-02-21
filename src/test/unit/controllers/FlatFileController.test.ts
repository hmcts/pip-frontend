import sinon from 'sinon';
import {Response} from 'express';
import {SummaryOfPublicationsService} from '../../../main/service/summaryOfPublicationsService';
import FlatFileController from '../../../main/controllers/FlatFileController';
import {PipRequest} from '../../../main/models/request/PipRequest';

const metaStub = sinon.stub(SummaryOfPublicationsService.prototype, 'getIndivPubMetadata');
const fileStub = sinon.stub(SummaryOfPublicationsService.prototype, 'getIndivPubFile');
const mockFile = new Blob(['testFile']);

const response = {
  send: () => {
    return '';
  },
  set: () => {
    return '';
  }} as unknown as Response;

const errResponse = {
  render: () => {
    return '';
  },
  set: () => {
    return '';
  }} as unknown as Response;

describe('Flat File Controller', () => {
  const flatFileController = new FlatFileController();

  it('should return a pdf when appropriate', () => {
    metaStub.withArgs(0).resolves({'isFlatFile':'true', 'sourceArtefactId':'doc.pdf'});
    fileStub.withArgs(0).resolves(mockFile);
    const request = {
      query: {'artefactId': 0}, i18n: {
        getDataByLanguage: '',
      },
    } as unknown as PipRequest;
    request.i18n.getDataByLanguage = jest.fn().mockReturnValue('mockI18n');
    const responseMock = sinon.mock(response);
    responseMock.expects('send').once().withArgs(mockFile);
    return flatFileController.get(request, response).then(() => {
      responseMock.verify();
    });
  });
  it('should return a docx file when appropriate', () => {
    metaStub.withArgs(1).resolves({'isFlatFile':'true', 'sourceArtefactId':'doc.docx'});
    fileStub.withArgs(1).resolves(mockFile);
    const request = {
      query: {'artefactId': 1}, i18n: {
        getDataByLanguage: '',
      },
    } as unknown as PipRequest;
    request.i18n.getDataByLanguage = jest.fn().mockReturnValue('mockI18n');
    const responseMock = sinon.mock(response);
    responseMock.expects('send').once().withArgs(mockFile);
    return flatFileController.get(request, response).then(() => {
      responseMock.verify();
    });
  });
  it('should return a json file when appropriate', () => {
    metaStub.withArgs(2).resolves({'isFlatFile':'true', 'sourceArtefactId':'doc.json'});
    fileStub.withArgs(2).resolves(mockFile);
    const request = {
      query: {'artefactId': 2}, i18n: {
        getDataByLanguage: '',
      },
    } as unknown as PipRequest;
    request.i18n.getDataByLanguage = jest.fn().mockReturnValue('mockI18n');
    const responseMock = sinon.mock(response);
    responseMock.expects('send').once().withArgs(mockFile);
    return flatFileController.get(request, response).then(() => {
      responseMock.verify();
    });
  });
  it('should return an error when there is an issue with metadata', () => {
    metaStub.withArgs(3).resolves({});
    fileStub.withArgs(3).resolves(mockFile);
    const request = {
      query: {'artefactId': 3}, i18n: {
        getDataByLanguage: '',
      },
    } as unknown as PipRequest;
    request.i18n.getDataByLanguage = jest.fn().mockReturnValue('mockI18n');
    const responseMock = sinon.mock(errResponse);
    responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng)['error']);
    return flatFileController.get(request, errResponse).then(() => {
      responseMock.verify();
    });
  });
});
