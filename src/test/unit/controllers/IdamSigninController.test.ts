import sinon from 'sinon';
import { Request, Response } from 'express';
import IdamSigninController from '../../../main/controllers/IdamSigninController';

const idamSigninController = new IdamSigninController();

describe('Idam Signin Controller', () => {
  it('should render the otp login page', () => {


    const response = { render: function() {return '';}} as unknown as Response;
    const request = {} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('idam-signin');

    idamSigninController.get(request, response);

    responseMock.verify();
  });


  it('should render idam url page if idam crime is selected', () => {

    const response = { redirect: function() {return '';}} as unknown as Response;
    const request = { body: { 'idam-select': 'crime'}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('redirect').once().withArgs('https://www.google.com');

    idamSigninController.post(request, response);

    responseMock.verify();
  });

  it('should render idam url page if idam cft is selected', () => {

    const response = { redirect: function() {return '';}} as unknown as Response;
    const request = { body: { 'idam-select': 'cft'}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('redirect').once().withArgs('https://www.google.com');

    idamSigninController.post(request, response);

    responseMock.verify();
  });


  it('should render same page if no select', () => {

    const response = { redirect: function() {return '';}} as unknown as Response;
    const request = { body: {}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('redirect').once().withArgs('idam-signin');

    idamSigninController.post(request, response);

    responseMock.verify();
  });

});
