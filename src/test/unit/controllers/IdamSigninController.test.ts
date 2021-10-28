import sinon from 'sinon';
import { Response } from 'express';
import IdamSigninController from '../../../main/controllers/IdamSigninController';
import { mockRequest } from '../mocks/mockRequest';

const idamSigninController = new IdamSigninController();

describe('Idam Signin Controller', () => {
  let i18n = {};
  it('should render the otp login page', () => {

    i18n = {
      'subscription-urn-search': {},
    };

    const response = { render: function() {return '';}} as unknown as Response;

    const request = mockRequest(i18n);
    const responseMock = sinon.mock(response);

    const expectedData = {
      ...i18n['idam-signin'],
    };

    responseMock.expects('render').once().withArgs('idam-signin', expectedData);

    idamSigninController.get(request, response);

    responseMock.verify();
  });


  it('should render idam url page if idam crime is selected', () => {

    const response = { redirect: function() {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    request.body = { 'idam-select': 'crime' };

    const responseMock = sinon.mock(response);

    responseMock.expects('redirect').once().withArgs('https://www.google.com');

    idamSigninController.post(request, response);

    responseMock.verify();
  });

  it('should render idam url page if idam cft is selected', () => {

    const response = { redirect: function() {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    request.body = { 'idam-select': 'cft' };

    const responseMock = sinon.mock(response);

    responseMock.expects('redirect').once().withArgs('https://www.google.com');

    idamSigninController.post(request, response);

    responseMock.verify();
  });


  it('should render same page if no select', () => {

    const response = { render: function() {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    request.body = { };

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('idam-signin');

    idamSigninController.post(request, response);

    responseMock.verify();
  });

});
