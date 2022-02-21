import sinon from 'sinon';
import {Response} from 'express';
import {PublicationService} from '../../../main/service/publicationService';
import ListTypeController from '../../../main/controllers/ListTypeController';
import {PipRequest} from '../../../main/models/request/PipRequest';

const jsonStub = sinon.stub(PublicationService.prototype, 'getIndivPubJson');
const mockJson = {};

const response = {
  send: () => {
    return '';
  },
  set: () => {
    return '';
  }} as unknown as Response;

describe('List Type Controller', () => {
  const listTypeController = new ListTypeController();

  it('should return a pdf when appropriate', () => {
    jsonStub.withArgs(0).resolves(mockJson);
    const request = {
      query: {'artefactId': 0}, i18n: {
        getDataByLanguage: '',
      },
    } as unknown as PipRequest;
    request.i18n.getDataByLanguage = jest.fn().mockReturnValue('mockI18n');
    const responseMock = sinon.mock(response);
    responseMock.expects('send').once().withArgs(mockJson);
    return listTypeController.get(request, response).then(() => {
      responseMock.verify();
    });
  });

});
