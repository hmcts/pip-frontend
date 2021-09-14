import OtpLoginController from '../../../main/controllers/OtpLoginController';
import sinon from 'sinon';
import { Request, Response } from 'express';

describe('Otp Login Controller', () => {
  it('should render the otp login page', () => {
    const otpLoginController = new OtpLoginController();

    const response = { render: function() {return '';}} as unknown as Response;
    const request = {} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('otp-login');

    otpLoginController.get(request, response);

    responseMock.verify();
  });


  it('should render subscription management page if entry is 6 characters long', () => {
    const otpLoginController = new OtpLoginController();

    const response = { redirect: function() {return '';}} as unknown as Response;
    const request = { body: { 'otp-code': '123456'}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('redirect').once().withArgs('subscription-management');

    otpLoginController.post(request, response);

    responseMock.verify();
  });


  it('should render same page if otp code is not 6 characters long', () => {
    const otpLoginController = new OtpLoginController();

    const response = { render: function() {return '';}} as unknown as Response;
    const request = { body: { 'otp-login': '1234'}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('otp-login');

    otpLoginController.post(request, response);

    responseMock.verify();
  });

  it('should render same page if no otp code is entered', () => {
    const otpLoginController = new OtpLoginController();

    const response = { render: function() {return '';}} as unknown as Response;
    const request = { body: {}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('otp-login');

    otpLoginController.post(request, response);

    responseMock.verify();
  });

  it('should render same page if otp code is not digits', () => {
    const otpLoginController = new OtpLoginController();

    const response = { render: function() {return '';}} as unknown as Response;
    const request = { body: { 'otp-login': 'abcdef'}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('otp-login');

    otpLoginController.post(request, response);

    responseMock.verify();
  });

});
