import OtpLoginAzureController from '../../../main/controllers/OtpLoginAzureController';
import sinon from 'sinon';
import { Request, Response } from 'express';

describe('Otp Login Controller', () => {
  it('should render the otp login azure page', () => {
    const otpLoginController = new OtpLoginAzureController();

    const response = { render: function() {return '';}} as unknown as Response;
    const request = {} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('otp-login-azure');

    otpLoginController.get(request, response);

    responseMock.verify();
  });

});
