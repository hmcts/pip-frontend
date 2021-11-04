import sinon from 'sinon';
import OtpTemplateController from '../../../main/controllers/OtpTemplateController';
import {Response} from 'express';
import {mockRequest} from '../mocks/mockRequest';

describe('Otp Template Controller', () => {
  it('should render the otp template page', () =>  {
    const otpTemplateController = new OtpTemplateController();

    const i18n = {
      'otp-template': {},
    };

    const response = { render: () => {return '';}} as unknown as Response;
    const request = mockRequest(i18n);

    const responseMock = sinon.mock(response);

    const expectedData = {
      ...i18n['otp-template'],
    };

    responseMock.expects('render').once().withArgs('otp-template', expectedData);

    otpTemplateController.get(request, response);

    responseMock.verify();
  });

});
