import sinon from 'sinon';
import OtpTemplateController from '../../../main/controllers/OtpTemplateController';
import {Request, Response} from 'express';

describe('Otp Template Controller', () => {
  it('should render the otp template page', () =>  {
    const otpTemplateController = new OtpTemplateController();

    const response = { render: () => {return '';}} as unknown as Response;
    const request = {} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('otp-template');

    otpTemplateController.get(request, response);

    responseMock.verify();
  });

});
