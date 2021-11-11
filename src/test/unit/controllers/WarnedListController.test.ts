import sinon from 'sinon';
import { Response } from 'express';
import WarnedListController from '../../../main/controllers/WarnedListController';
import {mockRequest} from '../mocks/mockRequest';

const warnedListController = new WarnedListController();

describe('Warned List Controller', () => {
  let i18n = {};
  it('should render warned list page', () => {

    i18n = {
      'warned-list': {},
    };

    const response = { render: () => {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    request.user = {id: 1};

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('warned-list', request.i18n.getDataByLanguage(request.lng)['warned-list']);

    warnedListController.get(request, response);
    responseMock.verify();
  });

  it('should render error page if no user has been set', () => {

    i18n = {
      'error': {},
    };

    const response = { render: () => {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    request.user = null;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng)['error']);

    warnedListController.get(request, response);
    responseMock.verify();
  });
});
