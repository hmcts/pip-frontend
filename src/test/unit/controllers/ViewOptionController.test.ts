import sinon from 'sinon';
import { Request, Response } from 'express';
import ViewOptionController from '../../../main/controllers/ViewOptionController';

describe('View Option Controller', () => {
  it('should render view options page', () => {
    const viewOptionController = new ViewOptionController();

    const response = { render: () => {return '';}} as unknown as Response;
    const request = {} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('view-option');

    viewOptionController.get(request, response);
    responseMock.verify();
  });

  it('should render search option page if choice is \'search\'', () => {
    const viewOptionController = new ViewOptionController();

    const response = { redirect: () => {return '';}} as unknown as Response;
    const request = { body: { 'view-choice': 'search'}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('redirect').once().withArgs('search-option');

    viewOptionController.post(request, response);
    responseMock.verify();
  });

  it('should render live hearings page if choice is \'live\'', () => {
    const viewOptionController = new ViewOptionController();

    const response = { redirect: () => {return '';}} as unknown as Response;
    const request = { body: { 'view-choice': 'live'}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('redirect').once().withArgs('live-hearings');

    viewOptionController.post(request, response);
    responseMock.verify();
  });

  it('should render same page if nothing selected', () => {
    const viewOptionController = new ViewOptionController();

    const response = { redirect: () => {return '';}} as unknown as Response;
    const request = { body: { 'view-choice': ''}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('redirect').once().withArgs('view-option');

    viewOptionController.post(request, response);
    responseMock.verify();
  });
});
