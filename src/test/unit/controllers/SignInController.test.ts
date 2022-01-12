import sinon from 'sinon';
import { Response } from 'express';
import {mockRequest} from '../mocks/mockRequest';
import SignInController from '../../../main/controllers/SignInController';

const signInController = new SignInController();
describe('Sign In Option Controller', () => {
  let i18n = {};
  it('should render the search options page', () => {

    i18n = {
      'sign-in': {},
    };

    const response = { render: function() {return '';}} as unknown as Response;
    const request = mockRequest(i18n);

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('sign-in', request.i18n.getDataByLanguage(request.lng)['sign-in']);

    signInController.get(request, response);

    responseMock.verify();
  });

  it('should render Sign In page if choice is \'hmcts\'', () => {

    const response = { redirect: function() {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    request.body = { 'sign-in': 'hmcts'};

    const responseMock = sinon.mock(response);

    responseMock.expects('redirect').once().withArgs('https://www.google.com');

    signInController.post(request, response);

    responseMock.verify();
  });

  it('should render Sign In page if choice is \'common\'', () => {

    const response = { redirect: function() {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    request.body = { 'sign-in': 'common'};

    const responseMock = sinon.mock(response);

    responseMock.expects('redirect').once().withArgs('https://www.google.com');

    signInController.post(request, response);

    responseMock.verify();
  });

  it('should render Sign In page if choice is \'pi\'', () => {

    const response = { redirect: function() {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    request.body = { 'sign-in': 'pi'};

    const responseMock = sinon.mock(response);

    responseMock.expects('redirect').once().withArgs('https://www.google.com');

    signInController.post(request, response);

    responseMock.verify();
  });

  it('should render Sign In page if choice is empty', () => {

    const response = { redirect: function() {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    request.body = { 'sign-in': ''};

    const responseMock = sinon.mock(response);

    responseMock.expects('redirect').once().withArgs('/sign-in');

    signInController.post(request, response);

    responseMock.verify();
  });

});
