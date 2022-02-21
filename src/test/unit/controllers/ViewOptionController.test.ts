import sinon from 'sinon';
import { Response } from 'express';
import ViewOptionController from '../../../main/controllers/ViewOptionController';
import {mockRequest} from '../mocks/mockRequest';

const viewOptionController = new ViewOptionController();

describe('View Option Controller', () => {
  let i18n = {};
  it('should render view options page', () => {

    i18n = {
      'view-option': {},
    };

    const response = { render: () => {return '';}} as unknown as Response;
    const request = mockRequest(i18n);

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('view-option', request.i18n.getDataByLanguage(request.lng)['view-option']);

    viewOptionController.get(request, response);
    responseMock.verify();
  });

  it('should render search option page if choice is \'search\'', () => {

    const response = { redirect: () => {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    request.body = { 'view-choice': 'search'};

    const responseMock = sinon.mock(response);

    responseMock.expects('redirect').once().withArgs('search');

    viewOptionController.post(request, response);
    responseMock.verify();
  });

  it('should render live hearings page if choice is \'live\'', () => {

    const response = { redirect: () => {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    request.body = { 'view-choice': 'live'};

    const responseMock = sinon.mock(response);

    responseMock.expects('redirect').once().withArgs('live-case-alphabet-search');

    viewOptionController.post(request, response);
    responseMock.verify();
  });

  it('should render single justice procedure page if choice is \'sjp\'', () => {

    const response = { redirect: () => {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    request.body = { 'view-choice': 'sjp'};

    const responseMock = sinon.mock(response);

    responseMock.expects('redirect').once().withArgs('summary-of-publications?courtId=0');

    viewOptionController.post(request, response);
    responseMock.verify();
  });

  it('should render same page if nothing selected', () => {
    const viewOptionController = new ViewOptionController();

    const response = { redirect: () => {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    request.body = { 'view-choice': ''};

    const responseMock = sinon.mock(response);

    responseMock.expects('redirect').once().withArgs('view-option');

    viewOptionController.post(request, response);
    responseMock.verify();
  });
});
